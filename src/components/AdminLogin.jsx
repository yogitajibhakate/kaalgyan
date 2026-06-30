import React, { useState } from 'react';
import { api } from '../api';

export default function AdminLogin({ onLoginSuccess, showToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    showToast('Verifying credentials...', 'loading');

    try {
      const data = await api.login(username.trim(), password);
      setIsLoading(false);
      showToast(`Login successful. Welcome, ${data.user.name}!`, 'success');
      onLoginSuccess(data.user);
    } catch (err) {
      setIsLoading(false);
      showToast(err.message || 'Invalid username or password', 'error');
      setErrors({
        auth: err.message || 'The username or password you entered is incorrect.'
      });
    }
  };

  const handleAdminBypass = async () => {
    setIsLoading(true);
    showToast('Logging in as Admin Coordinator...', 'loading');
    try {
      const data = await api.login('admin@gmail.com', 'admin@123');
      setIsLoading(false);
      showToast('Welcome, Admin Coordinator!', 'success');
      onLoginSuccess(data.user);
    } catch (err) {
      setIsLoading(false);
      showToast('Bypass failed: Server error', 'error');
    }
  };

  const handleKaalGyaniBypass = async () => {
    setIsLoading(true);
    showToast('Logging in as Swami Brahmadeva...', 'loading');
    try {
      const data = await api.login('3', 'password123');
      setIsLoading(false);
      showToast('Welcome, Swami Brahmadeva!', 'success');
      onLoginSuccess(data.user);
    } catch (err) {
      setIsLoading(false);
      showToast('Bypass failed: Server error', 'error');
    }
  };

  return (
    <section style={loginSectionStyle} className="animate-fade-in">
      <div className="container" style={loginContainerStyle}>
        <div className="card-premium" style={loginCardStyle}>
          
          {/* Header Icon */}
          <div style={logoWrapperStyle}>
            <div className="logo-icon" style={{ width: '56px', height: '56px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '28px', height: '28px' }}>
                <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                <path d="M12 6a4 4 0 100 8 4 4 0 000-8z" />
                <path d="M6 20v-2a6 6 0 0112 0v2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="heading-spiritual" style={{ marginTop: '0.75rem' }}>Coordinator Portal</h2>
            <p style={subtitleStyle}>Sign in to manage KaalGyan session requests.</p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            
            {errors.auth && (
              <div style={authErrorStyle} className="animate-fade-in">
                {errors.auth}
              </div>
            )}

            {/* Username field */}
            <div className="form-group">
              <label className="form-label">Email or Quick ID</label>
              <input
                type="text"
                name="username"
                className={`form-control ${errors.username ? 'error' : ''}`}
                placeholder="Enter Email or Quick ID"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors({}); }}
                disabled={isLoading}
              />
              {errors.username && <div className="form-error-msg">{errors.username}</div>}
            </div>

            {/* Password field */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                disabled={isLoading}
              />
              {errors.password && <div className="form-error-msg">{errors.password}</div>}
            </div>
            {/* Action buttons */}
            <div style={actionsStyle}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center', height: '48px', marginBottom: '1.5rem' }}
              >
                Sign In
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}

// Layout styling
const loginSectionStyle = {
  padding: '4rem 0 6rem 0',
  backgroundColor: 'var(--color-bg)',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
};

const loginContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const loginCardStyle = {
  width: '100%',
  maxWidth: '450px',
  boxShadow: 'var(--shadow-lg)',
  padding: '3rem 2rem',
};

const logoWrapperStyle = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '2rem',
};

const subtitleStyle = {
  fontSize: '0.9rem',
  color: 'var(--color-text-muted)',
  marginTop: '0.25rem',
};

const authErrorStyle = {
  backgroundColor: 'var(--color-error-bg)',
  color: 'var(--color-error)',
  padding: '10px 14px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '500',
  marginBottom: '1.5rem',
  border: '1px solid rgba(211, 47, 47, 0.2)',
  textAlign: 'center',
};

const helperBoxStyle = {
  backgroundColor: '#FFF8E1',
  border: '1px solid #FFE082',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '0.85rem',
  color: 'var(--color-text-muted)',
  marginBottom: '2rem',
  textAlign: 'left',
};

const codeStyle = {
  backgroundColor: 'rgba(91, 58, 41, 0.08)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontWeight: '600',
  color: 'var(--color-accent)',
};

const actionsStyle = {
  marginTop: '1.5rem',
};
