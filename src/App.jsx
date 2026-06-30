import React, { useState, useEffect } from 'react';
import { api } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import RequestForm from './components/RequestForm';
import SuccessView from './components/SuccessView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'request', 'success', 'admin', 'admin-dashboard', 'about', 'contact'
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // Load requests and session state dynamically
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      setLoggedInUser(user);
      if (currentPage === 'admin-dashboard') {
        api.getRequests()
          .then(data => setRequests(data))
          .catch(err => {
            console.error('Failed to load requests:', err);
            showToast('Session expired, please login again.', 'error');
            handleLogout();
          });
      }
    }
  }, [currentPage]);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type, duration });
  };

  const handleNavigate = (page) => {
    if (page === 'admin') {
      if (loggedInUser) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin');
      }
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestSubmit = async (newRequest) => {
    try {
      await api.createRequest(newRequest);
      showToast('Request submitted successfully!', 'success');
      setCurrentPage('success');
    } catch (e) {
      showToast(e.message || 'Failed to submit request. Please try again.', 'error');
      console.error(e);
    }
  };

  const handleUpdateRequest = async (id, updatedFields) => {
    try {
      const updated = await api.updateRequest(id, updatedFields);
      if (updated) {
        const data = await api.getRequests();
        setRequests(data);
        showToast(`Request ${id} updated successfully`, 'success');
      }
    } catch (e) {
      showToast(e.message || 'Error updating request', 'error');
      console.error(e);
    }
  };

  const handleBulkUpdateRequest = async (ids, updatedFields) => {
    try {
      const res = await api.bulkUpdateRequests(ids, updatedFields);
      if (res.success) {
        const data = await api.getRequests();
        setRequests(data);
        showToast(`Successfully updated ${res.updatedCount} requests`, 'success');
      }
    } catch (e) {
      showToast(e.message || 'Error performing bulk update', 'error');
      console.error(e);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await api.deleteRequest(id);
      const data = await api.getRequests();
      setRequests(data);
      showToast(`Request ${id} deleted successfully`, 'success');
    } catch (e) {
      showToast(e.message || 'Error deleting request', 'error');
      console.error(e);
    }
  };

  const handleLoginSuccess = async (user) => {
    setLoggedInUser(user);
    try {
      const data = await api.getRequests();
      setRequests(data);
      setCurrentPage('admin-dashboard');
    } catch (e) {
      showToast('Login successful', 'success');
      setCurrentPage('admin-dashboard');
    }
  };

  const handleLogout = () => {
    api.logout();
    setLoggedInUser(null);
    setRequests([]);
    showToast('Signed out successfully', 'info');
    setCurrentPage('home');
  };

  // Render Page Content dynamically based on state
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection onRequestSession={() => handleNavigate('request')} />
            <FeaturesGrid onStart={() => handleNavigate('request')} />
          </>
        );
      case 'request':
        return (
          <RequestForm 
            onSubmit={handleRequestSubmit} 
            showToast={showToast} 
          />
        );
      case 'success':
        return (
          <SuccessView onBackToHome={() => handleNavigate('home')} />
        );
      case 'admin':
        return (
          <AdminLogin 
            onLoginSuccess={handleLoginSuccess} 
            showToast={showToast} 
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            requests={requests}
            loggedInUser={loggedInUser}
            onUpdateRequest={handleUpdateRequest}
            onBulkUpdateRequest={handleBulkUpdateRequest}
            onDeleteRequest={handleDeleteRequest}
            showToast={showToast}
            onLogout={handleLogout}
          />
        );
      case 'about':
        return <AboutView onStart={() => handleNavigate('request')} />;
      case 'contact':
        return <ContactView showToast={showToast} />;
      default:
        return <HeroSection onRequestSession={() => handleNavigate('request')} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Toast Alert */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Navigation Header */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main style={{ flexGrow: 1 }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

// Subview 1: Home Page Features Grid
function FeaturesGrid({ onStart }) {
  return (
    <section style={featuresSectionStyle} className="animate-fade-in">
      <div className="container">
        <h2 className="heading-spiritual" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          How KaalGyan Session Works
        </h2>
        
        <div style={featuresGridStyle}>
          {/* Card 1 */}
          <div className="card-premium" style={featureCardStyle}>
            <div style={featureIconStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L19 12M5 12H4" />
              </svg>
            </div>
            <h3 style={featureTitleStyle}>Vedic Cosmic Insights</h3>
            <p style={featureDescriptionStyle}>
              Understand the impact of celestial bodies and time cycles (Kaal) on your personal and professional path.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-premium" style={featureCardStyle}>
            <div style={featureIconStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 style={featureTitleStyle}>Personal Growth</h3>
            <p style={featureDescriptionStyle}>
              Identify mental blocks, build emotional resilience, and receive tailored advice on meditation, yoga, and lifestyle.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-premium" style={featureCardStyle}>
            <div style={featureIconStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 style={featureTitleStyle}>Experienced Advisors</h3>
            <p style={featureDescriptionStyle}>
              All sessions are led by senior KaalGyanis who are long-time practitioners of spiritual sciences and meditation.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
          <button className="btn-primary" onClick={onStart}>
            Get Started &amp; Request a Session
          </button>
        </div>

      </div>
    </section>
  );
}

// Subview 2: About KaalGyan page
function AboutView({ onStart }) {
  return (
    <section style={aboutSectionStyle} className="animate-fade-in">
      <div className="container">
        
        <div style={aboutHeaderStyle}>
          <h2 className="heading-spiritual">About KaalGyan</h2>
          <p style={aboutSubtitleStyle}>Ancient wisdom for contemporary challenges, providing clarity, guidance, and peace of mind.</p>
        </div>

        <div style={aboutContentStyle}>
          <div style={aboutTextColumnStyle}>
            <h3>What is KaalGyan?</h3>
            <p>
              KaalGyan is a spiritual, intuitive, and astrological consultation framework, designed under the aegis of the Art of Living. The Sanskrit word <strong>"Kaal"</strong> refers to Time, and <strong>"Gyan"</strong> translates to Knowledge. Together, KaalGyan represents the deep understanding of time cycles and how they affect human behavior, emotions, and life events.
            </p>
            <p>
              Life presents us with various transitions, conflicts, and crossroads in areas like career, marriage, health, and spiritual progress. Through a personalized KaalGyan session, an expert advisor reads these transitions, analyzes your spiritual energetic footprint, and counsels you on alignment strategies.
            </p>
            <h3>Lineage and Trust</h3>
            <p>
              KaalGyan operates on principles of spiritual purity, Seva (selfless service), and deep cosmic science. Our senior KaalGyanis are seasoned spiritual practitioners who have undergone rigorous training in meditative awareness, Vedic wisdom, and intuitive reading.
            </p>
            <button className="btn-primary" onClick={onStart} style={{ marginTop: '1.5rem' }}>
              Book Your Session Now
            </button>
          </div>

          <div style={aboutQuoteColumnStyle}>
            <div style={quoteCardStyle}>
              <span style={quoteMarkStyle}>&ldquo;</span>
              <p style={quoteTextStyle}>
                When we align ourselves with the natural rhythm of time, our actions bear fruit easily. Wisdom is knowing how to flow with the current of life rather than fighting it.
              </p>
              <span style={quoteAuthorStyle}>— Spiritual Wisdom</span>
            </div>
            
            <div style={benefitsBoxStyle}>
              <h4 style={{ color: 'var(--color-accent)', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                Key Benefits of a Session
              </h4>
              <ul style={benefitsListStyle}>
                <li>Clarity on Career Blockages</li>
                <li>Relationship Compatibility &amp; Peace</li>
                <li>Identification of Energetic Obstacles</li>
                <li>Remedial Mantras &amp; Pranayama</li>
                <li>Spiritual Progress Acceleration</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Subview 3: Contact Us Page
function ContactView({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      showToast('Please fill in all contact fields', 'error');
      return;
    }

    setSending(true);
    showToast('Sending message...', 'loading');

    setTimeout(() => {
      setSending(false);
      setName('');
      setEmail('');
      setMsg('');
      showToast('Thank you! Your query has been sent to our support desk.', 'success');
    }, 1200);
  };

  return (
    <section style={contactSectionStyle} className="animate-fade-in">
      <div className="container">
        
        <div style={aboutHeaderStyle}>
          <h2 className="heading-spiritual">Contact Us</h2>
          <p style={aboutSubtitleStyle}>Have questions? Our support team is here to assist you with scheduling and information.</p>
        </div>

        <div style={contactContentStyle}>
          {/* Support Details */}
          <div className="card-premium" style={contactInfoCardStyle}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-accent)' }}>Get in Touch</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Feel free to reach out to us during our coordinator working hours (Monday to Saturday, 9:00 AM to 6:00 PM IST).
            </p>

            <div style={infoRowStyle}>
              <div style={infoIconStyle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Phone Support</strong>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>+91 80 6743 3633</span>
              </div>
            </div>

            <div style={infoRowStyle}>
              <div style={infoIconStyle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Email Address</strong>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>info@kaalgyan.artofliving.org</span>
              </div>
            </div>

            <div style={infoRowStyle}>
              <div style={infoIconStyle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Location</strong>
                <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                  Art of Living International Center, Kanakapura Road, Udayapura, Bengaluru, Karnataka 560082
                </span>
              </div>
            </div>
          </div>

          {/* Simple Contact Form */}
          <div className="card-premium" style={contactFormCardStyle}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-accent)' }}>Send a Message</h3>
            
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={sending}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe your query..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  disabled={sending}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

// Styling for Subviews
const featuresSectionStyle = {
  padding: '4rem 0 6rem 0',
  backgroundColor: '#FFFBF5',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
  marginTop: '1rem',
};

const featureCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2.5rem 1.75rem',
  textAlign: 'center',
};

const featureIconStyle = {
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  backgroundColor: '#FFF3E0',
  color: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};

const featureTitleStyle = {
  fontFamily: 'var(--font-serif)',
  fontSize: '1.25rem',
  color: 'var(--color-accent)',
  marginBottom: '0.75rem',
};

const featureDescriptionStyle = {
  fontSize: '0.9rem',
  color: 'var(--color-text-muted)',
  lineHeight: '1.6',
};

// About section styling
const aboutSectionStyle = {
  padding: '4rem 0 6rem 0',
  backgroundColor: 'var(--color-bg)',
};

const aboutHeaderStyle = {
  textAlign: 'center',
  marginBottom: '4rem',
};

const aboutSubtitleStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-muted)',
  maxWidth: '600px',
  margin: '0.5rem auto 0 auto',
};

const aboutContentStyle = {
  display: 'flex',
  gap: '4rem',
  flexWrap: 'wrap',
};

const aboutTextColumnStyle = {
  flex: '1 1 500px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const aboutQuoteColumnStyle = {
  flex: '1 1 300px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const quoteCardStyle = {
  backgroundColor: '#FFFBF5',
  border: '1px dashed var(--color-border)',
  borderRadius: '16px',
  padding: '2rem',
  position: 'relative',
  textAlign: 'left',
};

const quoteMarkStyle = {
  fontSize: '4rem',
  fontFamily: 'var(--font-serif)',
  color: 'var(--color-secondary)',
  position: 'absolute',
  top: '-15px',
  left: '15px',
  lineHeight: '1',
  opacity: 0.4,
};

const quoteTextStyle = {
  fontStyle: 'italic',
  fontSize: '1rem',
  color: 'var(--color-accent)',
  lineHeight: '1.6',
  position: 'relative',
  zIndex: 1,
  marginBottom: '1rem',
};

const quoteAuthorStyle = {
  fontWeight: '600',
  fontSize: '0.85rem',
  color: 'var(--color-primary-dark)',
};

const benefitsBoxStyle = {
  backgroundColor: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  padding: '2rem',
  textAlign: 'left',
  boxShadow: 'var(--shadow-sm)',
};

const benefitsListStyle = {
  listStyleType: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  fontSize: '0.9rem',
  fontWeight: '500',
};

// Contact page styling
const contactSectionStyle = {
  padding: '4rem 0 6rem 0',
  backgroundColor: 'var(--color-bg)',
};

const contactContentStyle = {
  display: 'flex',
  gap: '2.5rem',
  flexWrap: 'wrap',
};

const contactInfoCardStyle = {
  flex: '1 1 350px',
  textAlign: 'left',
};

const contactFormCardStyle = {
  flex: '1.2 1 450px',
  textAlign: 'left',
};

const infoRowStyle = {
  display: 'flex',
  gap: '1.25rem',
  marginBottom: '1.75rem',
  alignItems: 'flex-start',
};

const infoIconStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  backgroundColor: '#FFF3E0',
  color: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  svg: {
    width: '18px',
    height: '18px',
  }
};
