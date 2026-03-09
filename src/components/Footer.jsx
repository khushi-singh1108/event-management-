import React from 'react';

export default function Footer({ setPage }) {
  return (
    <footer style={{
      background: 'rgba(3,7,18,0.98)',
      borderTop: '1px solid rgba(0,245,255,0.1)',
      padding: '48px 24px 24px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src="/csmu-logo.jpg"
                alt="CSMU Logo"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 12px rgba(0,245,255,0.35)',
                  border: '2px solid rgba(0,245,255,0.25)',
                }}
              />
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                <span style={{ color: '#00f5ff' }}>CSMU</span>
              </span>
            </div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 16px' }}>
              The premier campus event management platform — connecting students with opportunities that shape their university journey.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏', 'in', '📘', '📸'].map((icon, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,245,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)'; e.currentTarget.style.color = '#00f5ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >{icon}</div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: '#00f5ff', marginBottom: 16, letterSpacing: 2 }}>NAVIGATION</h4>
            {[
              { label: 'Home', page: 'landing' },
              { label: 'All Events', page: 'events' },
              { label: 'Calendar', page: 'calendar' },
              { label: 'Student Dashboard', page: 'login' },
              { label: 'Admin Portal', page: 'login' },
            ].map(link => (
              <div key={link.label} onClick={() => setPage(link.page)} style={{
                fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)',
                marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#00f5ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >→ {link.label}</div>
            ))}
          </div>

          {/* Event Types */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: '#ff006e', marginBottom: 16, letterSpacing: 2 }}>EVENT TYPES</h4>
            {['Technical Workshops', 'Sports Events', 'Annual Cultural Fest', 'Internship Drives', 'Educational Seminars', 'Community Service', 'Entertainment Programs'].map(item => (
              <div key={item} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>· {item}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: '#8338ec', marginBottom: 16, letterSpacing: 2 }}>CONTACT</h4>
            {[
              { icon: '🏫', text: 'CSMU, Navi Mumbai - 410210' },
              { icon: '📧', text: 'events@university.edu' },
              { icon: '📞', text: '+91 44 2345 6789' },
              { icon: '⏰', text: 'Mon–Fri, 9AM–5PM IST' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Chhatrapati Shivaji Maharaj University. All rights reserved.
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(0,245,255,0.4)' }}>
            v2.6.0 · Built with React · Powered by CSMU
          </span>
        </div>
      </div>
    </footer>
  );
}
