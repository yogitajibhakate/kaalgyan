import React, { useState, useEffect, useRef } from 'react';

export default function MultiSelect({ options, selectedValues, onChange, placeholder = "Select issues...", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (disabled) return;
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(val => val !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const removeValue = (e, val) => {
    if (disabled) return;
    e.stopPropagation();
    onChange(selectedValues.filter(item => item !== val));
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="multiselect-container" ref={containerRef}>
      {/* Selection Control Box */}
      <div 
        className={`multiselect-control ${isOpen ? 'active' : ''}`} 
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        style={disabled ? { cursor: 'not-allowed', backgroundColor: '#F5F5F5', opacity: 0.7 } : {}}
      >
        {selectedValues.length === 0 ? (
          <span className="multiselect-placeholder">{placeholder}</span>
        ) : (
          <div className="multiselect-tags">
            {selectedValues.map(val => (
              <span key={val} className="multiselect-tag">
                {val}
                <button 
                  type="button" 
                  onClick={(e) => { if (!disabled) removeValue(e, val); }} 
                  className="multiselect-tag-remove"
                  disabled={disabled}
                  style={disabled ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Toggle Arrow Icon */}
        <span className="multiselect-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="multiselect-menu animate-fade-in-short">
          {/* Search Box */}
          <div className="multiselect-search-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="multiselect-search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="multiselect-search-input"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            {search && (
              <button 
                type="button" 
                className="multiselect-search-clear" 
                onClick={(e) => { e.stopPropagation(); setSearch(''); }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="multiselect-options">
            {filteredOptions.length === 0 ? (
              <div className="multiselect-no-options">No issues found</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div
                    key={option}
                    className={`multiselect-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleOption(option)}
                  >
                    <span className="multiselect-option-checkbox">
                      {isSelected && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="multiselect-option-text">{option}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        .multiselect-container {
          position: relative;
          width: 100%;
        }
        
        .multiselect-control {
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          min-height: 48px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .multiselect-control:hover {
          border-color: var(--color-primary-light);
        }
        
        .multiselect-control.active {
          border-color: var(--color-primary);
          background-color: #fff;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.08);
        }
        
        .multiselect-placeholder {
          color: var(--color-text-muted);
          opacity: 0.6;
          font-size: 0.95rem;
          user-select: none;
        }
        
        .multiselect-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          flex-grow: 1;
          padding-right: 8px;
        }
        
        .multiselect-tag {
          background-color: #FFF3E0;
          color: var(--color-primary-dark);
          border: 1.5px solid #FFE0B2;
          border-radius: 30px;
          padding: 2px 10px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }
        
        .multiselect-tag:hover {
          border-color: var(--color-primary-light);
        }
        
        .multiselect-tag-remove {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1;
        }
        
        .multiselect-tag-remove:hover {
          color: var(--color-error);
        }
        
        .multiselect-arrow {
          display: flex;
          align-items: center;
          color: var(--color-accent);
          opacity: 0.7;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .multiselect-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background-color: #fff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          overflow: hidden;
        }
        
        .multiselect-search-wrapper {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid var(--color-border);
          gap: 10px;
          background-color: var(--color-bg);
        }
        
        .multiselect-search-icon {
          width: 16px;
          height: 16px;
          color: var(--color-text-muted);
          opacity: 0.7;
        }
        
        .multiselect-search-input {
          border: none;
          background: transparent;
          flex-grow: 1;
          font-size: 0.9rem;
          color: var(--color-text-main);
          outline: none;
          padding: 0;
        }
        
        .multiselect-search-clear {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--color-text-muted);
        }
        
        .multiselect-options {
          max-height: 220px;
          overflow-y: auto;
        }
        
        .multiselect-no-options {
          padding: 14px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .multiselect-option {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          cursor: pointer;
          transition: var(--transition);
          gap: 12px;
          user-select: none;
        }
        
        .multiselect-option:hover {
          background-color: var(--color-bg);
        }
        
        .multiselect-option.selected {
          background-color: #FFFDE7;
        }
        
        .multiselect-option-checkbox {
          width: 18px;
          height: 18px;
          border: 1.5px solid var(--color-border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }
        
        .multiselect-option.selected .multiselect-option-checkbox {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
        }
        
        .multiselect-option-text {
          font-size: 0.9rem;
          color: var(--color-text-main);
          font-weight: 500;
        }
        
        .multiselect-option.selected .multiselect-option-text {
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        
        @keyframes fadeInShort {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-short {
          animation: fadeInShort 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
