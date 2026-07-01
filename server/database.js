import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Helper to ensure data folder and seed file exist
const ensureDbExists = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialDb = {
      users: [
        {
          id: '1',
          name: 'Coordinator Admin',
          email: 'admin@gmail.com',
          passwordHash: bcrypt.hashSync('admin@123', 10),
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Swami Brahmadeva',
          email: 'brahmadeva@kaalgyan.org',
          passwordHash: bcrypt.hashSync('password123', 10),
          role: 'kaalgyani',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Sri Mohan Ji',
          email: 'mohan@kaalgyan.org',
          passwordHash: bcrypt.hashSync('password123', 10),
          role: 'kaalgyani',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Smt. Radha Devi',
          email: 'radha@kaalgyan.org',
          passwordHash: bcrypt.hashSync('password123', 10),
          role: 'kaalgyani',
          active: true,
          createdAt: new Date().toISOString()
        }
      ],
      requests: [
        {
          RequestID: 'KG00000001',
          Name: 'Amit Sharma',
          Phone: '9876543210',
          Email: 'amit.sharma@example.com',
          Language: ['Hindi', 'English'],
          Issues: ['Career', 'Finance'],
          Status: 'New',
          AssignedTo: '',
          Notes: '',
          CreatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          RequestID: 'KG00000002',
          Name: 'Priya Patel',
          Phone: '8765432109',
          Email: 'priya.patel@example.com',
          Language: ['Gujarati'],
          Issues: ['Relationship', 'Family'],
          Status: 'In Progress',
          AssignedTo: 'Yogita Ji',
          Notes: 'First round conversation done. Scheduled detailed session for tomorrow.',
          CreatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          RequestID: 'KG00000003',
          Name: 'Rahul Verma',
          Phone: '7654321098',
          Email: 'rahul.verma@example.com',
          Language: ['Hindi'],
          Issues: ['Health', 'Spiritual Guidance'],
          Status: 'Completed',
          AssignedTo: 'Yogita Ji',
          Notes: 'Session completed. Client felt highly peaceful.',
          CreatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
};

ensureDbExists();

export const database = {
  read() {
    ensureDbExists();
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading database file:', e);
      return { users: [], requests: [] };
    }
  },

  write(data) {
    ensureDbExists();
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error writing database file:', e);
      return false;
    }
  },

  getUsers() {
    return this.read().users || [];
  },

  getRequests() {
    return this.read().requests || [];
  },

  saveUsers(users) {
    const data = this.read();
    data.users = users;
    this.write(data);
  },

  saveRequests(requests) {
    const data = this.read();
    data.requests = requests;
    this.write(data);
  }
};
