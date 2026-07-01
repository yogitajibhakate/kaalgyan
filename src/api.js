import { db } from './db';

const isLocalhost = window.location.hostname === 'localhost';

const API_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost ? 'http://localhost:5000/api' : 'https://kaalgyan.onrender.com/api');

const useLocalStorageDb = false; // Disabled to use Render database in production

const getHeaders = () => {
  const token = localStorage.getItem('kaalgyan_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Authentication
  async login(username, password) {
    if (useLocalStorageDb) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const practitioners = db.getKaalGyanis();
      const user = practitioners.find(p => p.email === username || p.id === username);
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      const isCorrect = user.email === 'admin@gmail.com' 
        ? password === 'admin@123'
        : (password === user.id || password === 'password123');
      if (!isCorrect) {
        throw new Error('Invalid username or password');
      }
      
      const mockToken = 'mock_jwt_token_for_' + user.id;
      localStorage.setItem('kaalgyan_token', mockToken);
      localStorage.setItem('kaalgyan_user', JSON.stringify(user));
      return { token: mockToken, user };
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(res);
    localStorage.setItem('kaalgyan_token', data.token);
    localStorage.setItem('kaalgyan_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('kaalgyan_token');
    localStorage.removeItem('kaalgyan_user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('kaalgyan_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Session Requests
  async getRequests() {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.getAll();
    }

    const res = await fetch(`${API_URL}/requests`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createRequest(requestData) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return db.add(requestData);
    }

    const res = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    return handleResponse(res);
  },

  async updateRequest(id, fields) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.update(id, fields);
    }

    const res = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(fields)
    });
    return handleResponse(res);
  },

  async bulkUpdateRequests(ids, fields) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const success = db.updateBulk(ids, fields);
      return { success, updatedCount: ids.length };
    }

    const res = await fetch(`${API_URL}/requests/bulk`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ ids, fields })
    });
    return handleResponse(res);
  },

  async deleteRequest(id) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.delete(id);
    }

    const res = await fetch(`${API_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Practitioners
  async getPractitioners() {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.getKaalGyanis();
    }

    const res = await fetch(`${API_URL}/practitioners`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async addPractitioner(name, email, role) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return db.addKaalGyani(name, email, role);
    }

    const res = await fetch(`${API_URL}/practitioners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, role })
    });
    return handleResponse(res);
  },

  async deletePractitioner(id) {
    if (useLocalStorageDb) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.deleteKaalGyani(id);
    }

    const res = await fetch(`${API_URL}/practitioners/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
