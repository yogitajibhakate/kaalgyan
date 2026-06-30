import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from './database.js';
import { authenticateToken, requireRole, JWT_SECRET } from './middleware/auth.js';
import { triggerAssignmentWebhook } from './webhook.js';

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const userLower = username.trim().toLowerCase();

  // 1. Check fallback built-in Admin Coordinator credentials
  if (userLower === 'admin@gmail.com' && password === 'admin@123') {
    const token = jwt.sign(
      { id: '1', email: 'admin@gmail.com', name: 'Coordinator Admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({
      token,
      user: { id: '1', email: 'admin@gmail.com', name: 'Coordinator Admin', role: 'admin' }
    });
  }

  // 2. Check dynamic list of users in the database
  const users = database.getUsers();
  const user = users.find(u => u.id === username.trim() || u.email.toLowerCase() === userLower);

  if (!user || !user.active) {
    return res.status(401).json({ error: 'Invalid username/email or account is inactive' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// ==========================================
// PRACTITIONERS (KaalGyani Directory)
// ==========================================

// Get list of practitioners (Admins & KaalGyanis)
router.get('/practitioners', authenticateToken, (req, res) => {
  const users = database.getUsers();
  // Strip password hash before returning
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  
  if (req.user.role === 'admin') {
    return res.json(safeUsers);
  }
  
  // KaalGyani only sees their own practitioner profile record
  const filtered = safeUsers.filter(u => u.id === req.user.id || u.email.toLowerCase() === req.user.email.toLowerCase());
  res.json(filtered);
});

// Register new practitioner (Super Admin only)
router.post('/practitioners', authenticateToken, requireRole(['admin']), (req, res) => {
  const { name, email, role, active } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const users = database.getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'A user with this email already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    passwordHash: bcrypt.hashSync('password123', 10), // default login password
    role: role || 'kaalgyani',
    active: active !== undefined ? active : true,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  database.saveUsers(users);

  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// Remove practitioner (Super Admin only)
router.delete('/practitioners/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const users = database.getUsers();
  const userToDelete = users.find(u => u.id === id);

  if (!userToDelete) {
    return res.status(404).json({ error: 'User not found' });
  }

  // System protected accounts
  if (userToDelete.email === 'admin@gmail.com') {
    return res.status(400).json({ error: 'Cannot delete system root accounts' });
  }

  const filtered = users.filter(u => u.id !== id);
  database.saveUsers(filtered);

  res.json({ success: true, message: `Removed ${userToDelete.name} from directory` });
});

// ==========================================
// SESSION REQUESTS
// ==========================================

// Get session requests
router.get('/requests', authenticateToken, (req, res) => {
  const requests = database.getRequests();
  
  if (req.user.role === 'admin') {
    return res.json(requests);
  }

  // KaalGyani can see requests assigned to them AND unassigned requests
  const filtered = requests.filter(r => 
    !r.AssignedTo || r.AssignedTo === req.user.name
  );
  res.json(filtered);
});

// Public submission of requests
router.post('/requests', (req, res) => {
  const { Name, Phone, Email, Language, Issues, Notes } = req.body;
  if (!Name || !Phone || !Email || !Language || !Issues) {
    return res.status(400).json({ error: 'Missing required request fields' });
  }
  const requests = database.getRequests();
  let maxIdNum = 0;
  requests.forEach(r => {
    const match = r.RequestID.match(/^KG(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIdNum) {
        maxIdNum = num;
      }
    }
  });
  const nextNum = maxIdNum + 1;
  const requestId = 'KG' + String(nextNum).padStart(3, '0');

  const newRequest = {
    RequestID: requestId,
    Name: Name.trim(),
    Phone: Phone.trim(),
    Email: Email.trim(),
    Language: Array.isArray(Language) ? Language : [Language],
    Issues: Array.isArray(Issues) ? Issues : [Issues],
    Status: 'New',
    AssignedTo: '',
    Notes: Notes ? Notes.trim() : '',
    CreatedAt: new Date().toISOString()
  };

  requests.push(newRequest);
  database.saveRequests(requests);

  res.status(201).json(newRequest);
});

// Update request (locked rules validation)
router.put('/requests/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const requests = database.getRequests();
  const reqIndex = requests.findIndex(r => r.RequestID === id);
  if (reqIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const request = requests[reqIndex];

  // Lock logic validation on the server side
  if (req.user.role === 'kaalgyani') {
    // If assigned to someone else, block
    if (request.AssignedTo && request.AssignedTo !== req.user.name) {
      return res.status(403).json({ error: 'This request is claimed by another practitioner' });
    }
    
    // KaalGyani can only assign to themselves or unassign their own. No reassigning to others.
    if (fields.AssignedTo && fields.AssignedTo !== req.user.name) {
      return res.status(403).json({ error: 'You can only assign requests to yourself' });
    }
  }

  // Apply updates
  const updatedRequest = {
    ...request,
    ...fields,
    // Preserve language and issues arrays type safety
    Language: fields.Language !== undefined ? (Array.isArray(fields.Language) ? fields.Language : [fields.Language]) : request.Language,
    Issues: fields.Issues !== undefined ? (Array.isArray(fields.Issues) ? fields.Issues : [fields.Issues]) : request.Issues
  };

  const isAssigned = !!updatedRequest.AssignedTo;
  const assigneeChanged = updatedRequest.AssignedTo !== request.AssignedTo;

  requests[reqIndex] = updatedRequest;
  database.saveRequests(requests);

  if (isAssigned && assigneeChanged) {
    triggerAssignmentWebhook(updatedRequest);
  }

  res.json(updatedRequest);
});

// Bulk update requests
router.put('/requests/bulk', authenticateToken, (req, res) => {
  const { ids, fields } = req.body;
  if (!ids || !Array.isArray(ids) || !fields) {
    return res.status(400).json({ error: 'Invalid bulk parameters' });
  }

  const requests = database.getRequests();
  const newlyAssignedRequests = [];
  let updatedCount = 0;

  const updatedRequests = requests.map(r => {
    if (ids.includes(r.RequestID)) {
      const isOwn = r.AssignedTo === req.user.name;
      const isUnassigned = !r.AssignedTo;

      // KaalGyani Bulk Assign to Me
      if (fields.AssignedTo === req.user.name) {
        if (req.user.role === 'kaalgyani' && (isUnassigned || isOwn)) {
          const updated = { ...r, AssignedTo: req.user.name, Status: 'In Progress' };
          if (r.AssignedTo !== req.user.name) {
            newlyAssignedRequests.push(updated);
          }
          updatedCount++;
          return updated;
        }
      }
      
      // Bulk Unassign (only allowed for own work)
      if (fields.AssignedTo === '') {
        if (isOwn || req.user.role === 'admin') {
          updatedCount++;
          return { ...r, AssignedTo: '', Status: 'New' };
        }
      }
    }
    return r;
  });

  database.saveRequests(updatedRequests);

  // Trigger webhooks for newly assigned requests
  newlyAssignedRequests.forEach(r => triggerAssignmentWebhook(r));

  res.json({ success: true, updatedCount });
});

// Delete request (locks check validation)
router.delete('/requests/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const requests = database.getRequests();
  const request = requests.find(r => r.RequestID === id);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  // KaalGyani can only delete their own assigned work
  if (req.user.role !== 'admin' && request.AssignedTo !== req.user.name) {
    return res.status(403).json({ error: 'Access forbidden: You can only delete requests assigned to yourself' });
  }

  const filtered = requests.filter(r => r.RequestID !== id);
  database.saveRequests(filtered);

  res.json({ success: true, message: `Request ${id} deleted successfully` });
});

export default router;
