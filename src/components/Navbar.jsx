import React from 'react';

export default function Navbar({ currentPage, onNavigate, loggedInUser }) {
  return (
    <header className="header-portal animate-fade-in">
      <div className="container nav-container">
        {/* Logo Section */}
        <div className="logo-section" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            {/* Custom Spiritual Sun/Lotus SVG */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
              <circle cx="12" cy="12" r="4" fill="#fff" />
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
            </svg>
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
