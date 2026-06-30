import React, { useState } from 'react';
import MultiSelect from './MultiSelect';

const LANGUAGES = [
  'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 
  'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Other'
];

const ISSUES = [
  'Career', 'Business', 'Finance', 'Marriage', 'Relationship', 
  'Family', 'Health', 'Education', 'Child Guidance', 'Property', 
  'Foreign Travel', 'Legal Matters', 'Spiritual Guidance', 'Personal Growth', 'Other'
];

export default function RequestForm({ onSubmit, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    language: [],
    issues: [],
    otherIssue: '',
    additionalDetails: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s.]+$/.test(value)) {
          error = 'Name can only contain letters, spaces, or dots';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,15}$/.test(value.replace(/\s+/g, ''))) {
          error = 'Enter a valid 10-15 digit phone number (e.g., +91 98765 43210)';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Enter a valid email address';
        }
        break;
      case 'language':
        if (!value || value.length === 0) {
          error = 'Please select at least one preferred language';
        }
        break;
      case 'issues':
        if (value.length === 0) {
          error = 'Please select at least one issue';
        }
        break;
      case 'otherIssue':
        if (formData.issues.includes('Other') && !value.trim()) {
          error = 'Please describe your other issue';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Clear error inline
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name] : ''
      }));
    }
  };

  const handleLanguagesChange = (selectedLanguages) => {
    setFormData(prev => ({
      ...prev,
      language: selectedLanguages
    }));

    if (errors.language) {
      setErrors(prev => ({
        ...prev,
        language: ''
      }));
    }
  };

  const handleIssuesChange = (selectedIssues) => {
    setFormData(prev => ({
      ...prev,
      issues: selectedIssues
    }));

    if (errors.issues) {
      setErrors(prev => ({
        ...prev,
        issues: ''
      }));
    }

    // Clear otherIssue validation error if 'Other' is deselected
    if (!selectedIssues.includes('Other') && errors.otherIssue) {
      setErrors(prev => ({
        ...prev,
        otherIssue: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms to proceed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct the highlighted fields in the form', 'error');
      // Scroll to the first error element
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0] || document.getElementById(`err-container-${firstError}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Form is valid - Submit
    setIsLoading(true);
    showToast('Submitting your session request...', 'loading');

    setTimeout(() => {
      setIsLoading(false);
      
      const newRequest = {
        Name: formData.name.trim(),
        Phone: formData.phone.trim(),
        Email: formData.email.trim(),
        Language: formData.language,
        Issues: formData.issues,
        OtherIssue: formData.issues.includes('Other') ? formData.otherIssue.trim() : '',
        AdditionalDetails: formData.additionalDetails.trim(),
      };

      onSubmit(newRequest);
    }, 1500); // 1.5s visual loading spinner
  };

  return (
    <section style={formSectionStyle} className="animate-fade-in" id="request-form-section">
      <div className="container" style={formContainerStyle}>
        <div className="card-premium" style={formCardStyle}>
          
          <div style={formHeaderStyle}>
            <h2 className="heading-spiritual" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Request a Session</h2>
            <p style={formSubtitleStyle}>Fill in your details and our coordinator will connect you with a KaalGyani.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name <span>*</span></label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.name && <div className="form-error-msg">{errors.name}</div>}
            </div>

            {/* Grid for Contact Details */}
            <div style={formGridStyle}>
              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">Phone Number <span>*</span></label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {errors.phone && <div className="form-error-msg">{errors.phone}</div>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {errors.email && <div className="form-error-msg">{errors.email}</div>}
              </div>
            </div>

            {/* Preferred Language (Multi-Select) */}
            <div className="form-group" id="err-container-language">
              <label className="form-label">
                Preferred Language(s) <span>*</span>{' '}
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal', fontSize: '0.82rem' }}>
                  (You can select multiple options)
                </span>
              </label>
              <MultiSelect
                options={LANGUAGES}
                selectedValues={formData.language}
                onChange={handleLanguagesChange}
                placeholder="Select preferred language(s)..."
                disabled={isLoading}
              />
              {errors.language && <div className="form-error-msg">{errors.language}</div>}
            </div>

            {/* Selected Issues Multi-Select */}
            <div className="form-group" id="err-container-issues">
              <label className="form-label">
                Issue(s) <span>*</span>{' '}
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal', fontSize: '0.82rem' }}>
                  (You can select multiple options)
                </span>
              </label>
              <MultiSelect
                options={ISSUES}
                selectedValues={formData.issues}
                onChange={handleIssuesChange}
                placeholder="Select one or multiple issues..."
                disabled={isLoading}
              />
              {errors.issues && <div className="form-error-msg">{errors.issues}</div>}
            </div>

            {/* Other Issue Description (Conditional) */}
            {formData.issues.includes('Other') && (
              <div className="form-group animate-fade-in">
                <label className="form-label">Please describe your issue <span>*</span></label>
                <textarea
                  name="otherIssue"
                  className={`form-control ${errors.otherIssue ? 'error' : ''}`}
                  rows="3"
                  placeholder="Tell us a bit about your specific concern..."
                  value={formData.otherIssue}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{ resize: 'vertical' }}
                />
                {errors.otherIssue && <div className="form-error-msg">{errors.otherIssue}</div>}
              </div>
            )}

            {/* Additional Details */}
            <div className="form-group">
              <label className="form-label">Additional Details <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal' }}>(Optional)</span></label>
              <textarea
                name="additionalDetails"
                className="form-control"
                rows="4"
                placeholder="Any further context, birth details, or preferred timings that might help the coordinator..."
                value={formData.additionalDetails}
                onChange={handleInputChange}
                disabled={isLoading}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Consent Checkbox */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkmark">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="checkbox-label" style={{ color: errors.consent ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                  I agree that my submitted information may be used for scheduling a KaalGyan session. <span>*</span>
                </span>
              </label>
              {errors.consent && <div className="form-error-msg" style={{ marginTop: '-1rem' }}>{errors.consent}</div>}
            </div>

            {/* Submit Button */}
            <div style={submitBtnWrapperStyle}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center', height: '50px' }}
              >
                {isLoading ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="submit-spinner">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" />
                      <path strokeLinecap="round" d="M12 2a10 10 0 0110 10" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        .submit-spinner {
          width: 20px;
          height: 20px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

// Layout styling
const formSectionStyle = {
  padding: '2rem 0 5rem 0',
  backgroundColor: 'var(--color-bg)',
};

const formContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const formCardStyle = {
  width: '100%',
  maxWidth: '700px',
  boxShadow: 'var(--shadow-lg)',
};

const formHeaderStyle = {
  textAlign: 'center',
  marginBottom: '2.5rem',
};

const formSubtitleStyle = {
  fontSize: '0.95rem',
  color: 'var(--color-text-muted)',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '0 1.5rem',
};

const submitBtnWrapperStyle = {
  marginTop: '1rem',
};
