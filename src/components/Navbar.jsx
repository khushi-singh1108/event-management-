import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'landing' },
    { label: 'Events', page: 'events' },
    { label: 'Calendar', page: 'calendar' },
    { label: 'About', page: 'about' },
  ];

  const handleNav = (page) => {
    setPage(page);
    setMenuOpen(false);
  };

  const handleDashboard = () => {
    if (user?.role === 'admin') setPage('admin');
    else setPage('student');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(3,7,18,0.95)' : 'rgba(3,7,18,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,245,255,0.15)',
      boxShadow: scrolled ? '0 4px 30px rgba(0,245,255,0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <div onClick={() => handleNav('landing')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/csmu-logo.jpg"
            alt="CSMU Logo"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 15px rgba(0,245,255,0.4)',
              border: '2px solid rgba(0,245,255,0.3)',
            }}
          />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            <span style={{ color: '#00f5ff' }}>CSMU</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {navLinks.map(link => (
            <button key={link.page} onClick={() => handleNav(link.page)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 6,
              color: currentPage === link.page ? '#00f5ff' : 'rgba(255,255,255,0.7)',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 600, letterSpacing: 0.5,
              transition: 'all 0.2s',
              borderBottom: currentPage === link.page ? '2px solid #00f5ff' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (currentPage !== link.page) e.target.style.color = '#fff'; }}
              onMouseLeave={e => { if (currentPage !== link.page) e.target.style.color = 'rgba(255,255,255,0.7)'; }}
            >{link.label}</button>
          ))}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 12 }}>
              <button onClick={handleDashboard} style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(131,56,236,0.15))',
                border: '1px solid rgba(0,245,255,0.4)', borderRadius: 8, padding: '8px 16px',
                color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Dashboard</button>
              <button onClick={logout} style={{
                background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.4)',
                borderRadius: 8, padding: '8px 14px', color: '#ff006e',
                fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => handleNav('login')} style={{
              marginLeft: 12,
              background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
              border: 'none', borderRadius: 8, padding: '9px 22px',
              color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 1,
              boxShadow: '0 0 20px rgba(0,245,255,0.3)',
              transition: 'all 0.2s',
            }}>LOGIN</button>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none', cursor: 'pointer',
          color: '#00f5ff', fontSize: 24,
        }} className="hamburger" aria-label="Toggle menu">☰</button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(13,17,23,0.98)', borderTop: '1px solid rgba(0,245,255,0.1)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(link => (
            <button key={link.page} onClick={() => handleNav(link.page)} style={{
              background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px',
              color: currentPage === link.page ? '#00f5ff' : 'rgba(255,255,255,0.8)',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            }}>{link.label}</button>
          ))}
          {user ? (
            <>
              <button onClick={handleDashboard} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px', color: '#8338ec', fontFamily: 'Rajdhani, sans-serif', fontSize: 16, cursor: 'pointer' }}>Dashboard</button>
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px', color: '#ff006e', fontFamily: 'Rajdhani, sans-serif', fontSize: 16, cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => handleNav('login')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px', color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 16, cursor: 'pointer' }}>Login</button>
          )}
        </div>
      )}
    </nav>
  );
}
