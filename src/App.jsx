import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState('landing');

  const showNavbar = !['student', 'admin'].includes(page);

  const renderPage = () => {
    switch (page) {
      case 'landing': return <LandingPage setPage={setPage} />;
      case 'events': return <EventsPage setPage={setPage} />;
      case 'calendar': return <CalendarPage setPage={setPage} />;
      case 'about': return <LandingPage setPage={setPage} />;
      case 'login': return <LoginPage setPage={setPage} />;
      case 'student': return user ? <StudentDashboard setPage={setPage} /> : <LoginPage setPage={setPage} />;
      case 'admin': return user?.role === 'admin' ? <AdminDashboard setPage={setPage} /> : <LoginPage setPage={setPage} />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <>
      {showNavbar && <Navbar currentPage={page} setPage={setPage} />}
      {renderPage()}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
