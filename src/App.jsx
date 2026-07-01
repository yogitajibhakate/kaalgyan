import React, { useState, useEffect } from 'react';
import { api } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutView from './components/AboutView';
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
        return <HeroSection onRequestSession={() => handleNavigate('request')} />;
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


