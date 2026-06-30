// Local Storage Database Manager for KaalGyan Session Requests

const STORAGE_KEY = 'kaalgyan_requests';

const SEED_REQUESTS = [
  {
    RequestID: 'KG-2001',
    Name: 'Rajesh Kumar',
    Phone: '+91 98765 43210',
    Email: 'rajesh.k@gmail.com',
    Language: 'Hindi',
    Issues: ['Career', 'Finance'],
    OtherIssue: '',
    AdditionalDetails: 'Facing constant blocks in my career progression and financial stability for the past year. Seeking guidance on paths to explore.',
    Status: 'New',
    AssignedTo: '',
    AdminNotes: 'Needs urgent scheduling. Prefers evening calls.',
    CreatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    UpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    RequestID: 'KG-2002',
    Name: 'Priya Nair',
    Phone: '+91 94460 12345',
    Email: 'priya.nair@outlook.com',
    Language: 'Malayalam',
    Issues: ['Marriage', 'Family'],
    OtherIssue: '',
    AdditionalDetails: 'Seeking astrological compatibility advice and family harmony guidance.',
    Status: 'In Progress',
    AssignedTo: 'Swami Brahmadeva',
    AdminNotes: 'Initiated contact via WhatsApp. Customer prefers a weekend slot. Waiting for advisor slot confirmation.',
    CreatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    UpdatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    RequestID: 'KG-2003',
    Name: 'Amit Sharma',
    Phone: '+91 88877 76665',
    Email: 'amit.sharma@yahoo.com',
    Language: 'English',
    Issues: ['Spiritual Guidance', 'Personal Growth', 'Other'],
    OtherIssue: 'Deep meditation blocks and lack of focus',
    AdditionalDetails: 'Have been practicing Kriya Yoga for 3 years, but lately experiencing restlessness during meditation. Looking for guidance from a senior KaalGyani.',
    Status: 'Session Scheduled',
    AssignedTo: 'Sri Mohan Ji',
    AdminNotes: 'Session confirmed for Wednesday 5:00 PM IST. Sent Zoom link and calendar invite.',
    CreatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    UpdatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    RequestID: 'KG-2004',
    Name: 'Lakshmi Hegde',
    Phone: '+91 91234 56789',
    Email: 'lakshmi.h@hotmail.com',
    Language: 'Kannada',
    Issues: ['Education', 'Child Guidance'],
    OtherIssue: '',
    AdditionalDetails: 'My son is appearing for Board exams and faces severe anxiety. Need guidance for his concentration and peace of mind.',
    Status: 'Completed',
    AssignedTo: 'Smt. Radha Devi',
    AdminNotes: 'Session successfully conducted. Shared breathing techniques and mantra recommendations. Parent expressed deep gratitude.',
    CreatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    UpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    RequestID: 'KG-2005',
    Name: 'Rahul Shah',
    Phone: '+91 99001 12233',
    Email: 'rahul.shah@gmail.com',
    Language: 'Gujarati',
    Issues: ['Business', 'Property'],
    OtherIssue: '',
    AdditionalDetails: 'Planning to purchase a new ancestral property, facing delays in documentation and legal disputes. Want an auspicious timing and guidance.',
    Status: 'Cancelled',
    AssignedTo: '',
    AdminNotes: 'Requested cancellation as the legal matters got resolved out of court. Will reach back next month for startup venture consultation.',
    CreatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    UpdatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const db = {
  // Initialize DB with seed requests if empty
  init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REQUESTS));
    }
  },

  // Get all requests
  getAll() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return JSON.parse(data) || [];
    } catch (e) {
      console.error("Failed to parse requests from local storage", e);
      return [];
    }
  },

  // Save requests list
  saveAll(requests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  },

  // Add a new request
  add(request) {
    const requests = this.getAll();
    const nextNum = requests.length > 0 
      ? Math.max(...requests.map(r => parseInt(r.RequestID.split('-')[1]) || 2000)) + 1
      : 2001;
    
    const newRequest = {
      ...request,
      RequestID: `KG-${nextNum}`,
      Status: 'New',
      AssignedTo: '',
      AdminNotes: '',
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };
    
    requests.unshift(newRequest); // Add to the top
    this.saveAll(requests);
    return newRequest;
  },

  // Update a request
  update(id, updatedFields) {
    const requests = this.getAll();
    const index = requests.findIndex(r => r.RequestID === id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        ...updatedFields,
        UpdatedAt: new Date().toISOString()
      };
      this.saveAll(requests);
      return requests[index];
    }
    return null;
  },

  // Update multiple requests in bulk
  updateBulk(ids, updatedFields) {
    const requests = this.getAll();
    let updatedCount = 0;
    ids.forEach(id => {
      const index = requests.findIndex(r => r.RequestID === id);
      if (index !== -1) {
        requests[index] = {
          ...requests[index],
          ...updatedFields,
          UpdatedAt: new Date().toISOString()
        };
        updatedCount++;
      }
    });
    if (updatedCount > 0) {
      this.saveAll(requests);
      return true;
    }
    return false;
  },

  // Delete a request
  delete(id) {
    const requests = this.getAll();
    const filtered = requests.filter(r => r.RequestID !== id);
    this.saveAll(filtered);
    return true;
  },

  // Get all KaalGyanis
  getKaalGyanis() {
    const key = 'kaalgyan_practitioners';
    let data = localStorage.getItem(key);
    if (!data) {
      const seed = [
        { id: '1', name: 'Coordinator Admin', email: 'admin@gmail.com', role: 'admin', active: true, createdAt: new Date().toISOString() },
        { id: '2', name: 'Yogita Ji', email: 'yogita22@navgurukul.org', role: 'kaalgyani', active: true, createdAt: new Date().toISOString() },
        { id: '3', name: 'Swami Brahmadeva', email: 'brahmadeva@kaalgyan.org', role: 'kaalgyani', active: true, createdAt: new Date().toISOString() },
        { id: '4', name: 'Sri Mohan Ji', email: 'mohan@kaalgyan.org', role: 'kaalgyani', active: true, createdAt: new Date().toISOString() },
        { id: '5', name: 'Smt. Radha Devi', email: 'radha@kaalgyan.org', role: 'kaalgyani', active: true, createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(data) || [];
    } catch(e) {
      return [];
    }
  },

  // Save KaalGyanis
  saveKaalGyanis(list) {
    localStorage.setItem('kaalgyan_practitioners', JSON.stringify(list));
  },

  // Add KaalGyani
  addKaalGyani(name, email, role, active) {
    const list = this.getKaalGyanis();
    const newKg = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'kaalgyani',
      active: active !== undefined ? active : true,
      createdAt: new Date().toISOString()
    };
    list.push(newKg);
    this.saveKaalGyanis(list);
    return newKg;
  },

  // Delete KaalGyani
  deleteKaalGyani(id) {
    const list = this.getKaalGyanis();
    const filtered = list.filter(kg => kg.id !== id);
    this.saveKaalGyanis(filtered);
    return true;
  }
};
