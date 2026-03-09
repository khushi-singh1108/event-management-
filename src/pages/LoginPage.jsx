import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ setPage }) {
  const { login, loginError, setLoginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = login(email, password);
    if (success) {
      const role = email === 'admin@university.edu' ? 'admin' : 'student';
      setPage(role === 'admin' ? 'admin' : 'student');
    }
    setLoading(false);
  };

  const fillCredentials = (role) => {
    if (role === 'student') { setEmail('student@university.edu'); setPassword('student123'); }
    else { setEmail('admin@university.edu'); setPassword('admin123'); }
    setLoginError('');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#030712',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 20px 40px',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(0,245,255,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(131,56,236,0.07) 0%, transparent 50%),
        linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: 'auto, auto, 50px 50px, 50px 50px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src="/csmu-logo.jpg"
            alt="CSMU Logo"
            style={{
              width: 64, height: 64, borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(0,245,255,0.4)',
              border: '3px solid rgba(0,245,255,0.3)',
              display: 'block',
            }}
          />
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px', textAlign: 'center' }}>
            <span style={{ color: '#00f5ff' }}>CSMU</span>
          </h1>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Campus Event Management Portal
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(13,17,23,0.9)',
          border: '1px solid rgba(0,245,255,0.15)',
          borderRadius: 20,
          backdropFilter: 'blur(30px)',
          padding: '36px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.05)',
        }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Sign In</h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
            Access your university portal
          </p>

          {/* Quick fill */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {['student', 'admin'].map(role => (
              <button key={role} onClick={() => fillCredentials(role)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: role === 'student' ? 'rgba(0,245,255,0.1)' : 'rgba(255,0,110,0.1)',
                border: `1px solid ${role === 'student' ? 'rgba(0,245,255,0.3)' : 'rgba(255,0,110,0.3)'}`,
                color: role === 'student' ? '#00f5ff' : '#ff006e',
                fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                letterSpacing: 0.5,
              }}>
                {role === 'student' ? '🎓 Student' : '🛠️ Admin'}
              </button>
            ))}
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 18,
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#ff006e',
            }}>⚠ {loginError}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                placeholder="your@university.edu"
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8, boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', borderRadius: 8, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'rgba(255,255,255,0.4)',
                }}>{showPwd ? '🙈' : '👁'}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer',
              background: loading ? 'rgba(0,245,255,0.3)' : 'linear-gradient(135deg, #00f5ff, #8338ec)',
              color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: 2,
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,245,255,0.4)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0, lineHeight: 1.7 }}>
              Demo credentials:<br />
              Student: student@university.edu / student123<br />
              Admin: admin@university.edu / admin123
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
          <span onClick={() => setPage('landing')} style={{ cursor: 'pointer', color: 'rgba(0,245,255,0.6)' }}>← Back to Home</span>
        </p>
      </div>
    </div>
  );
}
