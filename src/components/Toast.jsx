import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          border: '1px solid rgba(46, 125, 50, 0.2)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bg: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          border: '1px solid rgba(211, 47, 47, 0.2)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'loading':
        return {
          bg: '#FFFBEB',
          color: 'var(--color-primary)',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon toast-spin">
              <circle cx="12" cy="12" r="10" stroke="rgba(217, 119, 6, 0.2)" />
              <path strokeLinecap="round" d="M12 2a10 10 0 0110 10" />
            </svg>
          )
        };
      case 'info':
      default:
        return {
          bg: 'var(--color-info-bg)',
          color: 'var(--color-info)',
          border: '1px solid rgba(2, 136, 209, 0.2)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const config = getStyles();

  return (
    <div style={containerStyle}>
      <div style={{ ...toastStyle, backgroundColor: config.bg, color: config.color, border: config.border }}>
        <div style={iconWrapperStyle}>
          {config.icon}
        </div>
        <div style={messageStyle}>{message}</div>
        {type !== 'loading' && (
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        )}
      </div>
      <style>{`
        .toast-icon {
          width: 18px;
          height: 18px;
        }
        .toast-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Inline Styles for Toast positioning and layout
const containerStyle = {
  position: 'fixed',
  top: '24px',
  right: '24px',
  zIndex: 1100,
  animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
};

const toastStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 18px',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(91, 58, 41, 0.12)',
  minWidth: '280px',
  maxWidth: '450px',
  gap: '12px',
};

const iconWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const messageStyle = {
  fontSize: '0.9rem',
  fontWeight: '500',
  flexGrow: 1,
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'inherit',
  opacity: 0.6,
  padding: '0 4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1',
};
