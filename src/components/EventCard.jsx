import React, { useState } from 'react';

const STATUS_COLORS = {
  Upcoming: { bg: 'rgba(0,245,255,0.15)', border: 'rgba(0,245,255,0.4)', text: '#00f5ff' },
  Ongoing: { bg: 'rgba(6,214,160,0.15)', border: 'rgba(6,214,160,0.4)', text: '#06d6a0' },
  Past: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)', text: 'rgba(255,255,255,0.5)' },
};

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

export default function EventCard({ event, onClick, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const statusStyle = STATUS_COLORS[event.status] || STATUS_COLORS.Upcoming;
  const catColor = CATEGORY_COLORS[event.category] || '#00f5ff';
  const pct = Math.round((event.participants / event.capacity) * 100);

  return (
    <div
      onClick={() => onClick && onClick(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(22,27,34,0.95)'
          : 'rgba(13,17,23,0.8)',
        border: `1px solid ${hovered ? catColor + '60' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        backdropFilter: 'blur(20px)',
        padding: compact ? '16px' : '20px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${catColor}30, 0 0 30px ${catColor}15`
          : '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow bar top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${catColor}, transparent)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />

      {/* Poster + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          fontSize: compact ? 32 : 40, lineHeight: 1,
          filter: hovered ? `drop-shadow(0 0 10px ${catColor}80)` : 'none',
          transition: 'filter 0.3s',
        }}>{event.poster}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            background: statusStyle.bg, border: `1px solid ${statusStyle.border}`,
            color: statusStyle.text, borderRadius: 20, padding: '3px 10px',
            fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 1,
          }}>
            {event.status === 'Ongoing' && (
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: '#06d6a0', marginRight: 5,
                animation: 'pulse-glow 1.5s infinite',
              }} />
            )}
            {event.status}
          </span>
          <span style={{
            background: `${catColor}20`, border: `1px solid ${catColor}40`,
            color: catColor, borderRadius: 20, padding: '3px 10px',
            fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 600,
          }}>{event.category}</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: compact ? 13 : 15, fontWeight: 700,
        color: '#fff', margin: '0 0 8px 0', lineHeight: 1.3,
        textShadow: hovered ? `0 0 15px ${catColor}60` : 'none',
        transition: 'text-shadow 0.3s',
      }}>{event.title}</h3>

      {/* Date & Venue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>📅</span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {event.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>📍</span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{event.venue}</span>
        </div>
      </div>

      {/* Progress bar */}
      {!compact && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Participants</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: catColor }}>{event.participants}/{event.capacity}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: `linear-gradient(90deg, ${catColor}80, ${catColor})`,
              borderRadius: 2, transition: 'width 0.5s',
            }} />
          </div>
        </div>
      )}

      {/* Tags */}
      {!compact && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {event.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, padding: '2px 8px', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Register button */}
      <button
        onClick={e => { e.stopPropagation(); onClick && onClick(event); }}
        style={{
          width: '100%', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: event.registered
            ? 'rgba(6,214,160,0.15)'
            : `linear-gradient(135deg, ${catColor}30, ${catColor}15)`,
          border: `1px solid ${event.registered ? 'rgba(6,214,160,0.4)' : catColor + '50'}`,
          color: event.registered ? '#06d6a0' : catColor,
          fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 1,
          transition: 'all 0.2s',
        }}
      >
        {event.registered ? '✓ REGISTERED' : 'VIEW DETAILS'}
      </button>
    </div>
  );
}
