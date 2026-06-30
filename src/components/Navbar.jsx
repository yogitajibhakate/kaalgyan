import React from 'react';

export default function Navbar({ currentPage, onNavigate, loggedInUser }) {
  return (
    <header className="header-portal animate-fade-in">
      <div className="container nav-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://kaalgyan.artofliving.org/images/aol1_logo.svg" alt="KaalGyan Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="logo-text">KaalGyan</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '-3px' }}>Session Portal</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${currentPage === 'home' || currentPage === 'request' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
              >
                Contact
              </a>
            </li>
            <li>
              <button 
                className="btn-nav-admin"
                onClick={() => onNavigate('admin')}
                style={{
                  backgroundColor: (currentPage === 'admin' || currentPage === 'admin-dashboard') ? 'var(--color-primary)' : 'transparent',
                  color: (currentPage === 'admin' || currentPage === 'admin-dashboard') ? '#fff' : 'var(--color-primary)'
                }}
              >
                {loggedInUser ? `Dashboard (${loggedInUser.name})` : 'Admin Dashboard'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
