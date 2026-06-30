import React from 'react';

export default function SuccessView({ onBackToHome }) {
  return (
    <div style={containerStyle} className="animate-fade-in">
      <div className="card-premium" style={cardStyle}>
        
        {/* Animated Lotus SVG */}
        <div style={iconContainerStyle}>
          <svg viewBox="0 0 200 200" className="animate-bloom" style={svgStyle}>
            <defs>
              <linearGradient id="goldSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-secondary)" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
            </defs>

            {/* Glowing Aura Ring */}
            <circle cx="100" cy="100" r="80" stroke="rgba(244, 180, 0, 0.2)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <circle cx="100" cy="100" r="70" fill="url(#goldSaffron)" opacity="0.05" />

            {/* Bloom Petals Layer 1 (Outer) */}
            <g transform="translate(100, 100)">
              {/* Rotated outer petals */}
              <g transform="rotate(0)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.4" /></g>
              <g transform="rotate(45)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.3" /></g>
              <g transform="rotate(90)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.4" /></g>
              <g transform="rotate(135)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.3" /></g>
              <g transform="rotate(180)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.4" /></g>
              <g transform="rotate(225)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.3" /></g>
              <g transform="rotate(270)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.4" /></g>
              <g transform="rotate(315)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.3" /></g>
            </g>

            {/* Bloom Petals Layer 2 (Inner) */}
            <g transform="translate(100, 100) scale(0.75)">
              <g transform="rotate(22.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.75" /></g>
              <g transform="rotate(67.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.65" /></g>
              <g transform="rotate(112.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.75" /></g>
              <g transform="rotate(157.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.65" /></g>
              <g transform="rotate(202.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.75" /></g>
              <g transform="rotate(247.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.65" /></g>
              <g transform="rotate(292.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.75" /></g>
              <g transform="rotate(337.5)"><path d="M0 -50 C12 -25 25 -12 0 0 C-25 -12 -12 -25 0 -50 Z" fill="url(#goldSaffron)" opacity="0.65" /></g>
            </g>

            {/* Core Seed Bud */}
            <circle cx="100" cy="100" r="12" fill="var(--color-primary-dark)" />
            <circle cx="100" cy="100" r="6" fill="var(--color-secondary)" />
          </svg>
        </div>

        {/* Success message */}
        <h2 style={titleStyle}>Request Submitted Successfully</h2>
        
        <p style={messageStyle}>
          Thank you for submitting your request.
        </p>
        <p style={messageSubStyle}>
          Our KaalGyan team will review your details and contact you shortly to connect you with the appropriate KaalGyani.
        </p>

        {/* Home Button */}
        <div style={btnWrapperStyle}>
          <button className="btn-primary" onClick={onBackToHome}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

// Layout styling
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4rem 1.5rem',
  minHeight: '50vh',
};

const cardStyle = {
  width: '100%',
  maxWidth: '550px',
  textAlign: 'center',
  padding: '3.5rem 2.5rem',
  boxShadow: 'var(--shadow-lg)',
};

const iconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
};

const svgStyle = {
  width: '120px',
  height: '120px',
};

const titleStyle = {
  fontFamily: 'var(--font-serif)',
  color: 'var(--color-accent)',
  fontSize: '1.75rem',
  marginBottom: '1rem',
};

const messageStyle = {
  fontSize: '1.1rem',
  color: 'var(--color-primary-dark)',
  fontWeight: '600',
  marginBottom: '0.75rem',
};

const messageSubStyle = {
  fontSize: '0.95rem',
  color: 'var(--color-text-muted)',
  lineHeight: '1.6',
  marginBottom: '2.5rem',
};

const btnWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
};
