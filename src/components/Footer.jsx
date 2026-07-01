import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="portal-footer">
      <div className="container footer-grid">
        
        {/* Brand Identity */}
        <div className="footer-brand">
          <div className="footer-brand-logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://kaalgyan.artofliving.org/images/aol1_logo.svg" alt="KaalGyan Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            </div>
            <span className="footer-brand-title">KaalGyan</span>
          </div>
          <p className="footer-brand-desc">
            An offering facilitating divine guidance, cosmic insights, and self-realization to help align your path with cosmic harmony.
          </p>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h4 className="footer-col-title">Explore</h4>
          <ul className="footer-links">
            <li className="footer-link-item">
              <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
            </li>
            <li className="footer-link-item">
              <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About KaalGyan</a>
            </li>
            <li className="footer-link-item">
              <a href="#request" onClick={(e) => { e.preventDefault(); onNavigate('request'); }}>Book a Session</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals & Wisdom */}
        <div>
          <h4 className="footer-col-title">Portal Access</h4>
          <ul className="footer-links">
            <li className="footer-link-item">
              <a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>Admin Login</a>
            </li>
            <li className="footer-link-item">
              <a href="https://artofliving.org" target="_blank" rel="noopener noreferrer">Art of Living</a>
            </li>
            <li className="footer-link-item">
              <a href="https://automationlabs.online" target="_blank" rel="noopener noreferrer">AI Automation Labs</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright border */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <span>&copy; {new Date().getFullYear()} KaalGyan. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a 
              href="https://automationlabs.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: '600', transition: 'var(--transition)' }}
              onMouseOver={(e) => e.target.style.color = '#fff'}
              onMouseOut={(e) => e.target.style.color = 'var(--color-secondary)'}
            >
              AI Automation Labs
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
