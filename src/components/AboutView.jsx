import React from 'react';

export default function AboutView({ onStart }) {
  return (
    <section className="about-section animate-fade-in">
      {/* Decorative Rotating Background Circles */}
      <div className="decorative-circle-1"></div>
      <div className="decorative-circle-2"></div>

      <div className="container">
        
        {/* Header Section */}
        <div className="about-header">
          <h2 className="heading-spiritual">About KaalGyan</h2>
          <p className="about-subtitle">
            Bridging the timeline of your life with intuitive clarity, deep validation, and ancient cosmic wisdom.
          </p>
        </div>

        {/* Philosophy Callout Section */}
        <div className="philosophy-callout">
          <div className="philosophy-grid">
            <div className="philosophy-quote-wrapper">
              <div className="philosophy-quote">
                "What will happen to me tomorrow?"
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>
                The Eternal Question
              </div>
            </div>
            <div>
              <p className="philosophy-text">
                Humanity is often gripped by this single, persistent question. This constant worry about the future creates deep-seated anxiety, clouding the joy of the present moment. At <strong>KaalGyan</strong>, we exist to dissolve that anxiety and replace it with unwavering confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Grid (Power of Insight & Rooted in Wisdom) */}
        <div className="narrative-grid">
          
          {/* Card 1: The Power of Insight */}
          <div className="narrative-card">
            <div className="badge-emblem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>101 Intuitive Guides</span>
            </div>
            
            <h3>The Power of Insight</h3>
            <p>
              To trust the future, you must first make peace with the past. We have cultivated a unique collective of <strong>101 highly trained intuitive guides</strong>—individuals with a profound, refined ability to perceive the deeper timeline of your life.
            </p>
            <p>
              When you sit with our guides, they tap into an extraordinary depth of awareness. They help validate your journey by revealing insights about your past that only you hold.
            </p>
            <p>
              This undeniable connection builds the foundation of trust necessary to explore the possibilities of your future—illuminating paths, potentials, and solutions that even you might not yet see.
            </p>
          </div>

          {/* Card 2: Rooted in Profound Wisdom */}
          <div className="narrative-card">
            <div className="badge-emblem">
              <div className="metric-badge">25,000+</div>
              <span style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>Individuals Guided Globally</span>
            </div>
            
            <h3>Rooted in Profound Wisdom</h3>
            <p>
              The foundation of KaalGyan is built on a legacy of deep personal transformation, drawing inspiration from the wisdom of the <strong>Art of Living</strong> and the profound experience of guiding over 25,000 individuals globally.
            </p>
            <p>
              In this space, the extraordinary becomes a natural part of everyday life. We believe that experiencing the miraculous is not a rarity, but the natural byproduct of a stress-free, awakened mind.
            </p>
            <p>
              By aligning yourself with these natural rhythms, confusion fades away, opening the door to peace, trust, and alignment with your higher path.
            </p>
          </div>

        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <h3 className="mission-title heading-spiritual">Our Mission</h3>
          
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '-1.5rem auto 3rem auto', color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            Our purpose goes far beyond simply predicting what comes next. By helping you navigate the timeline of your life, our true goal is to eliminate your anxiety so you can wake up to a much larger, more beautiful reality.
          </p>

          <div className="mission-grid">
            
            {/* Pillar 1: Release Anxiety */}
            <div className="mission-card">
              <div className="mission-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12c0-3.87 3.13-7 7-7h5a7 7 0 0 1 7 7v0a7 7 0 0 1-7 7H9c-3.87 0-7-3.13-7-7z" />
                  <path d="M12 8l4 4-4 4" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h4>Release Anxiety</h4>
              <p>Break free from the relentless fear and worry regarding the unknown.</p>
            </div>

            {/* Pillar 2: Gain Validation */}
            <div className="mission-card">
              <div className="mission-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h4>Gain Validation</h4>
              <p>Find peace and deep trust through profound reflections on your past.</p>
            </div>

            {/* Pillar 3: Embrace the Future */}
            <div className="mission-card">
              <div className="mission-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 22 12 17 22 22 12 2" />
                </svg>
              </div>
              <h4>Embrace the Future</h4>
              <p>Step forward with absolute clarity, guided by intuitive foresight.</p>
            </div>

            {/* Pillar 4: Experience the Extraordinary */}
            <div className="mission-card">
              <div className="mission-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <path d="M12 3l4 4M12 21l-4-4" />
                </svg>
              </div>
              <h4>Experience the Extraordinary</h4>
              <p>Open your eyes to the everyday miracles that occur when the mind is truly at peace.</p>
            </div>

          </div>
        </div>

        {/* CTA Card */}
        <div className="about-cta">
          <h3>Step Into Clarity &amp; Confidence</h3>
          <p>
            Experience a session designed to dissolve anxiety, validate your life's timeline, and reveal the bright potentials awaiting you.
          </p>
          <button className="btn-primary" onClick={onStart}>
            <span>Book Your Session Now</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
