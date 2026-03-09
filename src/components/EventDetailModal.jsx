import React, { useEffect } from 'react';

const CATEGORY_COLORS = {
  Technical: '#00f5ff',
  'Annual Fest': '#ff006e',
  Internship: '#ffd60a',
  Sports: '#06d6a0',
  Workshop: '#8338ec',
  Educational: '#ffd60a',
  Entertainment: '#ff006e',
  Community: '#06d6a0',
};

export default function EventDetailModal({ event, onClose, onRegister }) {
  const catColor = CATEGORY_COLORS[event?.category] || '#00f5ff';
  const pct = event ? Math.round((event.participants / event.capacity) * 100) : 0;

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [event]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Event details: ${event.title}`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(13,17,23,0.98)',
          border: `1px solid ${catColor}40`,
          borderRadius: 20,
          backdropFilter: 'blur(30px)',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${catColor}15`,
          width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
      >
        {/* Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${catColor}20, rgba(131,56,236,0.2))`,
          borderBottom: `1px solid ${catColor}30`,
          padding: '32px 32px 24px',
          borderRadius: '20px 20px 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(${catColor}10 1px, transparent 1px), linear-gradient(90deg, ${catColor}10 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute', top: 16, right: 16, width: 36, height: 36,
              borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1,
            }}
          >×</button>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 72, marginBottom: 16, filter: `drop-shadow(0 0 20px ${catColor}80)` }}>{event.poster}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <span style={{
                background: `${catColor}25`, border: `1px solid ${catColor}60`, color: catColor,
                borderRadius: 20, padding: '4px 14px', fontFamily: 'Raj­dhani, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              }}>{event.category}</span>
              <span style={{
                background: event.status === 'Ongoing' ? 'rgba(6,214,160,0.2)' : event.status === 'Upcoming' ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${event.status === 'Ongoing' ? 'rgba(6,214,160,0.5)' : event.status === 'Upcoming' ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
                color: event.status === 'Ongoing' ? '#06d6a0' : event.status === 'Upcoming' ? '#00f5ff' : 'rgba(255,255,255,0.5)',
                borderRadius: 20, padding: '4px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 700,
              }}>{event.status}</span>
            </div>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 800,
              color: '#fff', margin: 0, textShadow: `0 0 20px ${catColor}60`,
            }}>{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px' }}>
          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { icon: '📅', label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
              { icon: '⏰', label: 'Time', value: event.time },
              { icon: '📍', label: 'Venue', value: event.venue },
              { icon: '👤', label: 'Organizer', value: event.organizer },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>{item.label}</span>
                </div>
                <p style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: catColor, marginBottom: 10, letterSpacing: 1 }}>ABOUT THIS EVENT</h4>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{event.description}</p>
          </div>

          {/* Capacity */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: catColor, margin: 0, letterSpacing: 1 }}>CAPACITY</h4>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: catColor }}>
                {event.participants} / {event.capacity} ({pct}%)
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: `linear-gradient(90deg, ${catColor}80, ${catColor})`,
                borderRadius: 4,
                boxShadow: `0 0 10px ${catColor}50`,
              }} />
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: catColor, marginBottom: 10, letterSpacing: 1 }}>TAGS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {event.tags.map(tag => (
                <span key={tag} style={{
                  background: `${catColor}15`, border: `1px solid ${catColor}30`,
                  color: catColor, borderRadius: 6, padding: '5px 12px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                }}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onRegister && onRegister(event.id)}
            disabled={event.status === 'Past'}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: event.status === 'Past' ? 'not-allowed' : 'pointer',
              background: event.registered
                ? 'rgba(6,214,160,0.2)'
                : event.status === 'Past'
                  ? 'rgba(255,255,255,0.05)'
                  : `linear-gradient(135deg, ${catColor}, #8338ec)`,
              border: `1px solid ${event.registered ? 'rgba(6,214,160,0.5)' : event.status === 'Past' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              color: event.registered ? '#06d6a0' : event.status === 'Past' ? 'rgba(255,255,255,0.3)' : '#030712',
              fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: 2,
              boxShadow: (!event.registered && event.status !== 'Past') ? `0 0 30px ${catColor}40` : 'none',
              transition: 'all 0.2s',
            }}
          >
            {event.registered ? '✓ ALREADY REGISTERED' : event.status === 'Past' ? 'EVENT ENDED' : 'REGISTER NOW'}
          </button>
        </div>
      </div>
    </div>
  );
}
