import React from 'react';

export default function HeroSection({ onRequestSession }) {
  return (
    <section style={heroSectionStyle} className="animate-fade-in">
      <div className="container" style={heroContainerStyle}>
        
        {/* Text content side */}
        <div style={heroTextStyle}>
          <div style={badgeWrapperStyle}>
            <span style={heroBadgeStyle}>Cosmic Alignment &amp; Inner Harmony</span>
          </div>
          <h1 className="heading-spiritual" style={mainTitleStyle}>
            Request a KaalGyan Session
          </h1>
          <p style={subtitleStyle}>
            Receive authentic insights on life, career, relationships, and health from experienced KaalGyanis, aligning your path with ancient Vedic wisdom.
          </p>
          <div style={ctaGroupStyle}>
            <button className="btn-primary" onClick={onRequestSession} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
              Request Session
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <a href="#about" style={{ display: 'none' }} /> {/* For structure */}
          </div>
        </div>

        {/* Custom SVG Illustration side */}
        <div style={heroIllustrationStyle}>
          <div style={blobBackdropStyle} className="animate-spin-slow" />
          <svg viewBox="0 0 400 400" className="animate-float" style={svgStyle}>
            <defs>
              <linearGradient id="saffronGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
              <linearGradient id="brownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
            </defs>

            {/* Orbit rings */}
            <circle cx="200" cy="200" r="160" stroke="rgba(217, 119, 6, 0.15)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <circle cx="200" cy="200" r="130" stroke="rgba(244, 180, 0, 0.2)" strokeWidth="1" fill="none" />
            
            {/* Glowing sun background */}
            <circle cx="200" cy="200" r="90" fill="url(#saffronGold)" opacity="0.08" />

            {/* Lotus Petals (Back Layer) */}
            <g transform="translate(200, 200) scale(1.1)">
              <path d="M0 -60 C15 -30 30 -15 0 0 C-30 -15 -15 -30 0 -60 Z" fill="url(#saffronGold)" opacity="0.25" />
              <path d="M0 60 C15 30 30 15 0 0 C-30 15 -15 30 0 60 Z" fill="url(#saffronGold)" opacity="0.25" />
              <path d="M-60 0 C-30 15 -15 30 0 0 C-15 -30 -30 -15 -60 0 Z" fill="url(#saffronGold)" opacity="0.25" />
              <path d="M60 0 C30 15 15 30 0 0 C15 -30 30 -15 60 0 Z" fill="url(#saffronGold)" opacity="0.25" />
            </g>

            {/* Yogi Silhouette */}
            <g transform="translate(145, 120) scale(0.9)">
              {/* Head */}
              <circle cx="60" cy="30" r="14" fill="var(--color-accent)" />
              {/* Halo / Aura */}
              <circle cx="60" cy="30" r="22" stroke="var(--color-secondary)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              
              {/* Torso & neck */}
              <path d="M60 44 L60 50 M45 55 C45 55 52 50 60 50 C68 50 75 55 75 55" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
              <path d="M35 60 C45 60 48 95 60 95 C72 95 75 60 85 60 C92 60 98 75 98 85 C98 95 85 110 60 110 C35 110 22 95 22 85 C22 75 28 60 35 60 Z" fill="url(#brownGold)" />
              
              {/* Meditating Arms */}
              <path d="M32 68 C25 75 22 85 24 88 C26 91 35 88 42 85" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M88 68 C95 75 98 85 96 88 C94 91 85 88 78 85" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Heart/Anahata Glow */}
              <circle cx="60" cy="72" r="6" fill="var(--color-secondary)" />
              <circle cx="60" cy="72" r="12" stroke="var(--color-secondary)" strokeWidth="1" fill="none" opacity="0.5" />
            </g>

            {/* Stars / sparkle details */}
            <circle cx="110" cy="80" r="2" fill="var(--color-secondary)" />
            <circle cx="300" cy="110" r="3" fill="var(--color-primary)" />
            <circle cx="80" cy="240" r="2.5" fill="var(--color-secondary)" />
            <circle cx="310" cy="270" r="1.5" fill="var(--color-accent)" />
            <circle cx="200" cy="340" r="2" fill="var(--color-secondary)" />
          </svg>
        </div>

      </div>
    </section>
  );
}

// Layout styling
const heroSectionStyle = {
  padding: '6rem 0 4rem 0',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  minHeight: '65vh',
};

const heroContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3rem',
  flexWrap: 'wrap',
};

const heroTextStyle = {
  flex: '1 1 500px',
  textAlign: 'left',
};

const badgeWrapperStyle = {
  marginBottom: '1rem',
};

const heroBadgeStyle = {
  backgroundColor: '#FFF3E0',
  color: 'var(--color-primary-dark)',
  padding: '6px 16px',
  borderRadius: '30px',
  fontSize: '0.8rem',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  border: '1px solid #FFE0B2',
};

const mainTitleStyle = {
  fontSize: '3rem',
  lineHeight: '1.15',
  marginBottom: '1.5rem',
  textAlign: 'left',
};

const subtitleStyle = {
  fontSize: '1.1rem',
  color: 'var(--color-text-muted)',
  marginBottom: '2.5rem',
  maxWidth: '560px',
};

const ctaGroupStyle = {
  display: 'flex',
  gap: '1rem',
};

const heroIllustrationStyle = {
  flex: '1 1 350px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const blobBackdropStyle = {
  position: 'absolute',
  width: '320px',
  height: '320px',
  backgroundColor: 'rgba(244, 180, 0, 0.06)',
  borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
  filter: 'blur(10px)',
  zIndex: 0,
};

const svgStyle = {
  width: '100%',
  maxWidth: '380px',
  height: 'auto',
  zIndex: 1,
};
