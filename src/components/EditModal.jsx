import React, { useState, useEffect } from 'react';
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

const STATUSES = [
  'New',
  'In Progress',
  'Contacted',
  'Session Scheduled',
  'Completed',
  'Cancelled'
];

export default function EditModal({ request, onClose, onSave, loggedInUser, practitioners = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    language: [],
    issues: [],
    otherIssue: '',
    additionalDetails: '',
    status: 'New',
    assignedTo: '',
    adminNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (request) {
      // Handle backward compatibility (convert string language to array if necessary)
      const languageArray = Array.isArray(request.Language)
        ? request.Language
        : (request.Language ? [request.Language] : []);

      setFormData({
        name: request.Name || '',
        phone: request.Phone || '',
        email: request.Email || '',
        language: languageArray,
        issues: request.Issues || [],
        otherIssue: request.OtherIssue || '',
        additionalDetails: request.AdditionalDetails || '',
        status: request.Status || 'New',
        assignedTo: request.AssignedTo || '',
        adminNotes: request.AdminNotes || ''
      });
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleIssuesChange = (selectedIssues) => {
    setFormData(prev => ({
      ...prev,
      issues: selectedIssues
    }));
  };

  const handleSave = () => {
    // Basic validations
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.language.length === 0) newErrors.language = 'Language is required';
    if (formData.issues.length === 0) newErrors.issues = 'At least one issue is required';
    if (formData.issues.includes('Other') && !formData.otherIssue.trim()) {
      newErrors.otherIssue = 'Other issue description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(request.RequestID, {
      Name: formData.name.trim(),
      Phone: formData.phone.trim(),
      Email: formData.email.trim(),
      Language: formData.language,
      Issues: formData.issues,
      OtherIssue: formData.issues.includes('Other') ? formData.otherIssue.trim() : '',
      AdditionalDetails: formData.additionalDetails.trim(),
      Status: formData.status,
      AssignedTo: formData.assignedTo,
      AdminNotes: formData.adminNotes.trim()
    });
  };

  // Determine field access based on loggedInUser role and assignment ownership
  const isNotAdmin = loggedInUser?.role !== 'admin';
  const canEditStatusAndAssign = loggedInUser?.role === 'admin' || !request.AssignedTo || request.AssignedTo === loggedInUser?.name;
  const isStatusDisabled = !canEditStatusAndAssign;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-bloom" style={{ maxWidth: '650px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-accent)' }}>
            Edit Request {request.RequestID}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name {!isNotAdmin && <span>*</span>}</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                disabled={isNotAdmin}
              />
              {errors.name && <div className="form-error-msg">{errors.name}</div>}
            </div>

            {/* Language (Multi-Select) */}
            <div className="form-group">
              <label className="form-label">Preferred Language(s) {!isNotAdmin && <span>*</span>}</label>
              <MultiSelect
                options={LANGUAGES}
                selectedValues={formData.language}
                onChange={(selected) => {
                  setFormData(prev => ({ ...prev, language: selected }));
                  if (errors.language) setErrors(prev => ({ ...prev, language: '' }));
                }}
                disabled={isNotAdmin}
                placeholder="Select language(s)..."
              />
              {errors.language && <div className="form-error-msg">{errors.language}</div>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone {!isNotAdmin && <span>*</span>}</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isNotAdmin}
              />
              {errors.phone && <div className="form-error-msg">{errors.phone}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email {!isNotAdmin && <span>*</span>}</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={isNotAdmin}
              />
              {errors.email && <div className="form-error-msg">{errors.email}</div>}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Request Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isStatusDisabled}
                title={isStatusDisabled ? "You can only change status for requests assigned to you." : "Request Status"}
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Assign KaalGyani (Only self-assignment or unassigning is permitted) */}
            <div className="form-group">
              <label className="form-label">Assign KaalGyani</label>
              <select
                name="assignedTo"
                className="form-control"
                value={formData.assignedTo}
                onChange={handleInputChange}
                disabled={isStatusDisabled}
                title={isStatusDisabled ? "This request is claimed by another practitioner" : "Assign KaalGyani"}
              >
                <option value="">-- Unassigned --</option>
                {loggedInUser?.role === 'admin' ? (
                  practitioners
                    .filter(p => p.active)
                    .map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))
                ) : (
                  <>
                    {loggedInUser?.name && (
                      <option value={loggedInUser.name}>{loggedInUser.name} (You)</option>
                    )}
                    {formData.assignedTo && formData.assignedTo !== loggedInUser?.name && (
                      <option value={formData.assignedTo}>{formData.assignedTo}</option>
                    )}
                  </>
                )}
              </select>
            </div>

          </div>

          {/* Issues Multi-Select */}
          <div className="form-group">
            <label className="form-label">Selected Issue(s) {!isNotAdmin && <span>*</span>}</label>
            <MultiSelect
              options={ISSUES}
              selectedValues={formData.issues}
              onChange={handleIssuesChange}
              disabled={isNotAdmin}
            />
            {errors.issues && <div className="form-error-msg">{errors.issues}</div>}
          </div>

          {/* Other Issue Description */}
          {formData.issues.includes('Other') && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Other Issue Description {!isNotAdmin && <span>*</span>}</label>
              <input
                type="text"
                name="otherIssue"
                className={`form-control ${errors.otherIssue ? 'error' : ''}`}
                value={formData.otherIssue}
                onChange={handleInputChange}
                disabled={isNotAdmin}
              />
              {errors.otherIssue && <div className="form-error-msg">{errors.otherIssue}</div>}
            </div>
          )}

          {/* Additional details */}
          <div className="form-group">
            <label className="form-label">User Notes / Details</label>
            <textarea
              name="additionalDetails"
              className="form-control"
              rows="2"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              style={{ resize: 'vertical' }}
              disabled={isNotAdmin}
            />
          </div>

          {/* Admin notes */}
          <div className="form-group">
            <label className="form-label">Coordinator Notes (Internal)</label>
            <textarea
              name="adminNotes"
              className="form-control"
              rows="3"
              placeholder="Add internal comments, call logs, scheduling notes..."
              value={formData.adminNotes}
              onChange={handleInputChange}
              style={{ resize: 'vertical' }}
              disabled={isStatusDisabled}
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.5rem 1.25rem' }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-sm)' }}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
