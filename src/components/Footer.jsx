import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={footerStyle}>
      <div className="container" style={footerContainerStyle}>
        
        {/* About Section */}
        <div style={sectionStyle}>
          <div style={logoWrapperStyle}>
            <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <circle cx="12" cy="12" r="4" fill="#fff" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            </div>
            <span style={logoTextStyle}>KaalGyan Portal</span>
          </div>
          <p style={descriptionStyle}>
            An offering facilitating divine guidance, cosmic insights, and self-realization to help align your path with cosmic harmony.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={sectionStyle}>
          <h4 style={headingStyle}>Explore</h4>
          <ul style={linkListStyle}>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={linkStyle}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={linkStyle}>About KaalGyan</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={linkStyle}>Contact Us</a></li>
            <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} style={linkStyle}>Admin Login</a></li>
          </ul>
        </div>

        {/* Contact info Section */}
        <div style={sectionStyle}>
          <h4 style={headingStyle}>Connect</h4>
          <p style={infoTextStyle}>
            Email: info@kaalgyan.artofliving.org<br />
            Phone: +91 80 6743 3633<br />
            Art of Living International Center,<br />
            Bengaluru, Karnataka, India
          </p>
        </div>

      </div>

      {/* Copyright border */}
      <div style={copyrightWrapperStyle}>
        <div className="container" style={copyrightContainerStyle}>
          <span>&copy; {new Date().getFullYear()} KaalGyan. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a 
              href="https://automationlabs.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: '600' }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              AI Automation Labs
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// Inline styling for the Footer
const footerStyle = {
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-bg)',
  padding: '4rem 0 0 0',
  marginTop: 'auto',
  borderTop: '2px solid var(--color-secondary)',
  zIndex: 10,
};

const footerContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3rem',
  justifyContent: 'space-between',
  paddingBottom: '3rem',
};

const sectionStyle = {
  flex: '1 1 250px',
};

const logoWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
};

const logoTextStyle = {
  fontFamily: 'var(--font-serif)',
  fontSize: '1.2rem',
  fontWeight: '700',
  color: 'var(--color-secondary)',
};

const descriptionStyle = {
  fontSize: '0.85rem',
  opacity: 0.8,
  lineHeight: '1.6',
};

const headingStyle = {
  color: 'var(--color-secondary)',
  fontSize: '1rem',
  fontWeight: '600',
  marginBottom: '1.25rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const linkListStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const linkStyle = {
  fontSize: '0.85rem',
  opacity: 0.8,
  transition: 'opacity 0.2s',
};

const infoTextStyle = {
  fontSize: '0.85rem',
  opacity: 0.8,
  lineHeight: '1.6',
};

const copyrightWrapperStyle = {
  borderTop: '1px solid rgba(232, 220, 203, 0.1)',
  padding: '1.5rem 0',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
};

const copyrightContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.8rem',
  opacity: 0.6,
  flexWrap: 'wrap',
  gap: '1rem',
};
