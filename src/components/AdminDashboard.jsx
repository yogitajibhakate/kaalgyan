import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';
import { api } from '../api';

const LANGUAGES = [
  'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 
  'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Other'
];

const ISSUES = [
  'Career', 'Business', 'Finance', 'Marriage', 'Relationship', 
  'Family', 'Health', 'Education', 'Child Guidance', 'Property', 
  'Foreign Travel', 'Legal Matters', 'Spiritual Guidance', 'Personal Growth', 'Other'
];

export default function AdminDashboard({ 
  requests, 
  loggedInUser, 
  onUpdateRequest, 
  onBulkUpdateRequest, 
  onDeleteRequest, 
  showToast, 
  onLogout 
}) {
  // Tabs & Practitioner Directory state
  const [activeTab, setActiveTab] = useState('requests');
  const [practitioners, setPractitioners] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      api.getPractitioners()
        .then(data => setPractitioners(data))
        .catch(err => console.error('Error fetching practitioners:', err));
    }
  }, [activeTab, loggedInUser]);

  const [newKgName, setNewKgName] = useState('');
  const [newKgEmail, setNewKgEmail] = useState('');
  const [newKgRole, setNewKgRole] = useState('kaalgyani');

  const handleAddPractitioner = async (e) => {
    e.preventDefault();
    if (!newKgName.trim() || !newKgEmail.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }
    
    try {
      const newPractitioner = await api.addPractitioner(newKgName.trim(), newKgEmail.trim(), newKgRole);
      const data = await api.getPractitioners();
      setPractitioners(data);
      setNewKgName('');
      setNewKgEmail('');
      setNewKgRole('kaalgyani');
      showToast(`Registered KaalGyani ${newPractitioner.name} successfully`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to register practitioner', 'error');
    }
  };

  const handleDeletePractitioner = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the directory?`)) {
      try {
        await api.deletePractitioner(id);
        const data = await api.getPractitioners();
        setPractitioners(data);
        showToast(`Removed ${name} from directory`, 'success');
      } catch (err) {
        showToast(err.message || 'Failed to remove practitioner', 'error');
      }
    }
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterIssue, setFilterIssue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Row selection state
  const [selectedIDs, setSelectedIDs] = useState([]);

  // Modal state
  const [editingRequest, setEditingRequest] = useState(null);

  // Compute stats
  const totalRequests = requests.length;
  
  const todayRequests = requests.filter(req => {
    const reqDate = new Date(req.CreatedAt).toDateString();
    const todayDate = new Date().toDateString();
    return reqDate === todayDate;
  }).length;

  const pendingRequests = requests.filter(req => 
    req.Status === 'New' || req.Status === 'In Progress'
  ).length;

  const completedRequests = requests.filter(req => 
    req.Status === 'Completed'
  ).length;

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.Phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.RequestID.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage = filterLanguage ? (
      Array.isArray(req.Language) 
        ? req.Language.includes(filterLanguage) 
        : req.Language === filterLanguage
    ) : true;
    
    const matchesIssue = filterIssue ? req.Issues.includes(filterIssue) : true;
    
    const matchesStatus = filterStatus ? req.Status === filterStatus : true;

    return matchesSearch && matchesLanguage && matchesIssue && matchesStatus;
  });

  // Check if a request is already assigned to someone else
  const isAssignedToOtherUser = (req) => {
    return req.AssignedTo && 
           loggedInUser && 
           req.AssignedTo !== loggedInUser.name;
  };

  // Get selectable requests (not assigned to others)
  const getSelectableRequests = () => {
    return filteredRequests.filter(req => !isAssignedToOtherUser(req));
  };

  // Selection handlers
  const handleSelectRow = (id, req) => {
    if (isAssignedToOtherUser(req)) return; // Prevent selection of requests assigned to others

    if (selectedIDs.includes(id)) {
      setSelectedIDs(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIDs(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    const selectable = getSelectableRequests();
    if (selectedIDs.length === selectable.length) {
      setSelectedIDs([]);
    } else {
      setSelectedIDs(selectable.map(r => r.RequestID));
    }
  };

  // Bulk assignment logic
  const handleBulkAssignToMe = () => {
    if (selectedIDs.length === 0) return;
    const assignName = loggedInUser ? loggedInUser.name : 'KaalGyani Practitioner';
    onBulkUpdateRequest(selectedIDs, {
      AssignedTo: assignName,
      Status: 'In Progress'
    });
    setSelectedIDs([]);
    showToast(`Successfully assigned ${selectedIDs.length} requests to you (${assignName})`, 'success');
  };

  // Bulk unassignment logic
  const handleBulkUnassign = () => {
    if (selectedIDs.length === 0) return;
    
    // Filter selected IDs to only those assigned to the current user
    const idsToUnassign = selectedIDs.filter(id => {
      const req = requests.find(r => r.RequestID === id);
      return req && req.AssignedTo === loggedInUser?.name;
    });

    if (idsToUnassign.length === 0) {
      showToast('No eligible requests to unassign.', 'error');
      return;
    }

    onBulkUpdateRequest(idsToUnassign, {
      AssignedTo: '',
      Status: 'New'
    });
    setSelectedIDs([]);
    showToast(`Successfully unassigned ${idsToUnassign.length} requests`, 'success');
  };

  // Reset all search & filter fields
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLanguage('');
    setFilterIssue('');
    setFilterStatus('');
    setSelectedIDs([]);
    showToast('Filters cleared', 'info');
  };

  // Export to Excel (CSV)
  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      showToast('No requests to export', 'error');
      return;
    }

    const headers = [
      'Request ID', 'Name', 'Phone', 'Email', 'Language', 
      'Issues', 'Other Issue', 'Additional Details', 'Status', 
      'Assigned To', 'Admin Notes', 'Created At'
    ];

    const csvRows = [headers.join(',')];

    filteredRequests.forEach(req => {
      const row = [
        req.RequestID,
        `"${(req.Name || '').replace(/"/g, '""')}"`,
        `"${(req.Phone || '').replace(/"/g, '""')}"`,
        `"${(req.Email || '').replace(/"/g, '""')}"`,
        `"${Array.isArray(req.Language) ? req.Language.join(' | ') : (req.Language || '')}"`,
        `"${(req.Issues || []).join(' | ')}"`,
        `"${(req.OtherIssue || '').replace(/"/g, '""')}"`,
        `"${(req.AdditionalDetails || '').replace(/"/g, '""')}"`,
        req.Status,
        `"${(req.AssignedTo || '').replace(/"/g, '""')}"`,
        `"${(req.AdminNotes || '').replace(/"/g, '""')}"`,
        new Date(req.CreatedAt).toLocaleString()
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kaalgyan_sessions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully exported ${filteredRequests.length} requests`, 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to permanently delete request ${id}?`)) {
      onDeleteRequest(id);
      setSelectedIDs(prev => prev.filter(item => item !== id));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'In Progress': return 'badge-in-progress';
      case 'Contacted': return 'badge-contacted';
      case 'Session Scheduled': return 'badge-session-scheduled';
      case 'Completed': return 'badge-completed';
      case 'Cancelled': return 'badge-cancelled';
      default: return '';
    }
  };

  const formatDate = (isoStr) => {
    const date = new Date(isoStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectable = getSelectableRequests();
  const isAllSelectableChecked = selectable.length > 0 && selectedIDs.length === selectable.length;

  return (
    <div style={dashboardSectionStyle} className="animate-fade-in">
      <div className="container">
        
        {/* Dashboard Title Panel */}
        <div style={titlePanelStyle}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', margin: 0 }}>Coordinator Dashboard</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Logged in as <strong style={{ color: 'var(--color-primary-dark)' }}>{loggedInUser?.name}</strong> ({loggedInUser?.role === 'kaalgyani' ? 'KaalGyani Practitioner' : 'Administrator'})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={handleExportCSV} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Excel
            </button>
            <button className="btn-danger" onClick={onLogout} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* 4 Dashboard Stats Cards */}
        <div style={statsGridStyle}>
          {/* Card 1 */}
          <div style={statCardStyle}>
            <div style={statCardHeaderStyle}>
              <span style={statCardTitleStyle}>Total Requests</span>
              <div style={{ ...statIconStyle, backgroundColor: '#E1F5FE', color: '#0288D1' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
            </div>
            <div style={statCardValueStyle}>{totalRequests}</div>
          </div>
          {/* Card 2 */}
          <div style={statCardStyle}>
            <div style={statCardHeaderStyle}>
              <span style={statCardTitleStyle}>Today's Requests</span>
              <div style={{ ...statIconStyle, backgroundColor: '#FFF3E0', color: 'var(--color-primary)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div style={statCardValueStyle}>{todayRequests}</div>
          </div>
          {/* Card 3 */}
          <div style={statCardStyle}>
            <div style={statCardHeaderStyle}>
              <span style={statCardTitleStyle}>Pending Requests</span>
              <div style={{ ...statIconStyle, backgroundColor: '#FFFDE7', color: '#F57F17' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
            </div>
            <div style={statCardValueStyle}>{pendingRequests}</div>
          </div>
          {/* Card 4 */}
          <div style={statCardStyle}>
            <div style={statCardHeaderStyle}>
              <span style={statCardTitleStyle}>Completed Sessions</span>
              <div style={{ ...statIconStyle, backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div style={statCardValueStyle}>{completedRequests}</div>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '24px',
          paddingBottom: '2px'
        }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'requests' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'requests' ? '3px solid var(--color-primary)' : '3px solid transparent',
              paddingBottom: '10px',
              fontFamily: 'var(--font-serif)',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('requests')}
          >
            Session Requests
          </button>
          {loggedInUser?.role === 'admin' && (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'practitioners' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'practitioners' ? '3px solid var(--color-primary)' : '3px solid transparent',
                paddingBottom: '10px',
                fontFamily: 'var(--font-serif)',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTab('practitioners')}
            >
              KaalGyani Directory
            </button>
          )}
        </div>

        {activeTab === 'requests' && (
          <>
            {/* Filter Toolbar Card */}
            <div className="card-premium" style={filterCardStyle}>
              <div style={filterGridStyle}>
                
                {/* Search Input */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Search Requests</label>
                  <div style={searchWrapperStyle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={searchIconStyle}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ID, Name, Email, Phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Filter Language</label>
                  <select
                    className="form-control"
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                  >
                    <option value="">All Languages</option>
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Issue Filter */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Filter Issue</label>
                  <select
                    className="form-control"
                    value={filterIssue}
                    onChange={(e) => setFilterIssue(e.target.value)}
                  >
                    <option value="">All Issues</option>
                    {ISSUES.map(issue => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Filter Status</label>
                  <select
                    className="form-control"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Session Scheduled">Session Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

              </div>

              {/* Clear Filters Button (Conditional) */}
              {(searchTerm || filterLanguage || filterIssue || filterStatus) && (
                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={handleResetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Search &amp; Filters
                  </button>
                </div>
              )}
            </div>

            {/* Requests Table Container */}
            <div style={tableContainerWrapperStyle}>
              <div style={tableScrollStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Request ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Phone</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Language</th>
                      <th style={thStyle}>Issues</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Assigned To</th>
                      <th style={thStyle}>Created At</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ ...tdStyle, textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', opacity: 0.5 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>No matching requests found</span>
                            <span style={{ fontSize: '0.85rem' }}>Try clearing filters or checking other tab</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map(req => {
                        const isLocked = isAssignedToOtherUser(req);
                        return (
                          <tr key={req.RequestID} style={trStyle} className="table-row-hover">
                            <td style={{ ...tdStyle, fontWeight: '700', color: 'var(--color-primary-dark)' }}>{req.RequestID}</td>
                            <td style={{ ...tdStyle, fontWeight: '600' }}>{req.Name}</td>
                            <td style={tdStyle}>{req.Phone}</td>
                            <td style={{ ...tdStyle, fontSize: '0.85rem' }}>{req.Email}</td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '150px' }}>
                                {Array.isArray(req.Language) ? (
                                  req.Language.map(lang => (
                                    <span key={lang} style={{
                                      backgroundColor: '#FFF3E0',
                                      color: '#E65100',
                                      border: '1px solid #FFE0B2',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {lang}
                                    </span>
                                  ))
                                ) : (
                                  req.Language && (
                                    <span style={{
                                      backgroundColor: '#FFF3E0',
                                      color: '#E65100',
                                      border: '1px solid #FFE0B2',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {req.Language}
                                    </span>
                                  )
                                )}
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <div style={issuesListStyle}>
                                {req.Issues.map(issue => (
                                  <span key={issue} style={issuePillStyle}>{issue}</span>
                                ))}
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <span className={`badge ${getStatusBadgeClass(req.Status)}`}>
                                {req.Status}
                              </span>
                            </td>
                            <td style={tdStyle}>
                              {req.AssignedTo ? (
                                <span style={{ fontWeight: '500' }}>{req.AssignedTo}</span>
                              ) : (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Unassigned</span>
                              )}
                            </td>
                            <td style={{ ...tdStyle, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(req.CreatedAt)}</td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                              <div style={actionButtonsContainerStyle}>
                                {/* Edit / Lock Details & Notes */}
                                <button 
                                  style={{ 
                                    ...actionBtnStyle,
                                    opacity: isLocked ? 0.5 : 1,
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    color: isLocked ? 'var(--color-text-muted)' : 'var(--color-primary-dark)'
                                  }} 
                                  onClick={() => {
                                    if (!isLocked) {
                                      setEditingRequest(req);
                                    }
                                  }}
                                  disabled={isLocked}
                                  title={isLocked ? `Locked: Assigned to ${req.AssignedTo}` : "Edit Details & Notes"}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                                    {isLocked ? (
                                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                                    ) : (
                                      <>
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </>
                                    )}
                                  </svg>
                                </button>
                                 
                                {/* Delete (Allowed for Coordinator Admin, or KaalGyani if assigned to themselves) */}
                                {(loggedInUser?.role === 'admin' || (loggedInUser?.role === 'kaalgyani' && req.AssignedTo === loggedInUser?.name)) && (
                                  <button 
                                    style={{ ...actionBtnStyle, color: 'var(--color-error)' }} 
                                    onClick={() => handleDelete(req.RequestID)}
                                    title="Delete Request"
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'practitioners' && loggedInUser?.role === 'admin' && (
          <div className="animate-bloom">
            {/* Add Practitioner Form (Admin Only) */}
            {loggedInUser?.role === 'admin' && (
              <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.25rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register New KaalGyani
                </h3>
                <form onSubmit={handleAddPractitioner} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)) 180px', gap: '1rem', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Swami Anand"
                      value={newKgName}
                      onChange={(e) => setNewKgName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. anand@kaalgyan.org"
                      value={newKgEmail}
                      onChange={(e) => setNewKgEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ height: '48px', justifyContent: 'center', width: '100%' }}>
                    Register User
                  </button>
                </form>
              </div>
            )}

            {/* Practitioners Table */}
            <div style={tableContainerWrapperStyle}>
              <div style={tableScrollStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>System Role</th>
                      <th style={thStyle}>Connection Status</th>
                      <th style={thStyle}>Registration Date</th>
                      {loggedInUser?.role === 'admin' && <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {practitioners.length === 0 ? (
                      <tr>
                        <td colSpan={loggedInUser?.role === 'admin' ? 7 : 6} style={{ ...tdStyle, textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                          No registered users found.
                        </td>
                      </tr>
                    ) : (
                      practitioners.map(kg => (
                        <tr key={kg.id} style={trStyle} className="table-row-hover">
                          <td style={{ ...tdStyle, fontWeight: '700', color: 'var(--color-primary-dark)' }}>{kg.id}</td>
                          <td style={{ ...tdStyle, fontWeight: '600' }}>{kg.name}</td>
                          <td style={tdStyle}>{kg.email}</td>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              backgroundColor: kg.role === 'admin' ? '#FFF3E0' : '#E8F5E9',
                              color: kg.role === 'admin' ? '#E65100' : '#2E7D32',
                              border: kg.role === 'admin' ? '1px solid #FFE0B2' : '1px solid #C8E6C9'
                            }}>
                              {kg.role === 'admin' ? 'Coordinator Admin' : 'KaalGyani'}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              color: kg.active ? 'var(--color-success)' : 'var(--color-text-muted)'
                            }}>
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: kg.active ? 'var(--color-success)' : '#9e9e9e'
                              }} />
                              {kg.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={tdStyle}>{new Date(kg.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          {loggedInUser?.role === 'admin' && (
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                              {kg.email === 'admin@gmail.com' ? (
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>System Root</span>
                              ) : (
                                <button
                                  className="btn-danger"
                                  onClick={() => handleDeletePractitioner(kg.id, kg.name)}
                                  style={{
                                    padding: '4px 12px',
                                    fontSize: '0.8rem',
                                    backgroundColor: '#D32F2F',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)'
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Request details and notes modal */}
      {editingRequest && (
        <EditModal
          request={editingRequest}
          loggedInUser={loggedInUser}
          practitioners={practitioners}
          onClose={() => setEditingRequest(null)}
          onSave={(id, updatedFields) => {
            onUpdateRequest(id, updatedFields);
            setEditingRequest(null);
          }}
        />
      )}

      {/* Internal table hovering styles */}
      <style>{`
        .table-row-hover {
          transition: background-color 0.2s;
        }
        .table-row-hover:hover {
          background-color: #FFFBF5;
        }
      `}</style>
    </div>
  );
}

// Inline Styles for Dashboard
const dashboardSectionStyle = {
  padding: '2.5rem 0 5rem 0',
  backgroundColor: 'var(--color-bg)',
  flexGrow: 1,
};

const titlePanelStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1.5rem',
  textAlign: 'left',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2.5rem',
};

const statCardStyle = {
  backgroundColor: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'left',
};

const statCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const statCardTitleStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const statIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const statCardValueStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: 'var(--color-accent)',
  lineHeight: '1',
};

const filterCardStyle = {
  padding: '1.75rem',
  marginBottom: '2rem',
  boxShadow: 'var(--shadow-sm)',
};

const filterGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
};

const searchWrapperStyle = {
  position: 'relative',
};

const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  color: 'var(--color-text-muted)',
  opacity: 0.7,
};

const clearFilterBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary-dark)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  padding: 0,
};

const bulkActionBarStyle = {
  backgroundColor: '#FFF8E1',
  border: '1px solid #FFE082',
  borderRadius: '12px',
  padding: '12px 20px',
  marginBottom: '1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  accentColor: 'var(--color-primary)',
};

const tableContainerWrapperStyle = {
  backgroundColor: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
};

const tableScrollStyle = {
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const thStyle = {
  backgroundColor: '#FFFBF5',
  borderBottom: '2px solid var(--color-border)',
  color: 'var(--color-accent)',
  fontSize: '0.85rem',
  fontWeight: '700',
  padding: '16px 20px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const trStyle = {
  borderBottom: '1px solid var(--color-border)',
};

const tdStyle = {
  padding: '16px 20px',
  fontSize: '0.9rem',
  color: 'var(--color-text-main)',
  verticalAlign: 'middle',
};

const issuesListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  maxWidth: '220px',
};

const issuePillStyle = {
  backgroundColor: '#F5EBE6',
  color: 'var(--color-text-muted)',
  fontSize: '0.75rem',
  fontWeight: '500',
  padding: '2px 8px',
  borderRadius: '12px',
  border: '1px solid #E6D8D0',
};

const actionButtonsContainerStyle = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emptyStateStyle = {
  padding: '4rem',
  textAlign: 'center',
};

const emptyIconStyle = {
  fontSize: '3rem',
  color: 'var(--color-border)',
  marginBottom: '1rem',
};
