import React, { useState } from 'react';

export default function DashboardSidebar({ role, activeSection, setSection, collapsed, setCollapsed }) {
  const studentSections = [
    { id: 'overview', label: 'Overview', icon: '⚡' },
    { id: 'myevents', label: 'My Events', icon: '🎫' },
    { id: 'upcoming', label: 'Upcoming', icon: '🚀' },
    { id: 'ongoing', label: 'Ongoing', icon: '🔴' },
    { id: 'past', label: 'Past Events', icon: '📚' },
    { id: 'certificates', label: 'Certificates', icon: '🏆' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const adminSections = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'allevents', label: 'All Events', icon: '📋' },
    { id: 'create', label: 'Create Event', icon: '➕' },
    { id: 'registered', label: 'Registrations', icon: '👥' },
    { id: 'upcoming', label: 'Upcoming', icon: '🚀' },
    { id: 'ongoing', label: 'Ongoing', icon: '🔴' },
    { id: 'past', label: 'Past Events', icon: '📚' },
    { id: 'notifications', label: 'Notifications', icon: '📢' },
  ];

  const sections = role === 'admin' ? adminSections : studentSections;
  const accentColor = role === 'admin' ? '#ff006e' : '#00f5ff';

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: 'rgba(13,17,23,0.95)',
      borderRight: `1px solid ${accentColor}20`,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 64,
      overflow: 'hidden',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end',
          color: 'rgba(255,255,255,0.4)', fontSize: 18,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >{collapsed ? '▶' : '◀'}</button>

      {/* Role badge */}
      {!collapsed && (
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
            borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: accentColor, letterSpacing: 1 }}>
              {role === 'admin' ? 'ADMIN MODE' : 'STUDENT MODE'}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setSection(section.id)}
              title={collapsed ? section.label : ''}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 12, padding: collapsed ? '12px 0' : '11px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? `${accentColor}15` : 'none',
                border: 'none',
                borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                borderRadius: isActive ? '0 8px 8px 0' : '0 8px 8px 0',
                cursor: 'pointer', marginBottom: 2,
                color: isActive ? accentColor : 'rgba(255,255,255,0.55)',
                fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: isActive ? 700 : 500,
                letterSpacing: 0.5,
                transition: 'all 0.2s',
                textShadow: isActive ? `0 0 10px ${accentColor}60` : 'none',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{section.icon}</span>
              {!collapsed && <span>{section.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.3 }} />
    </aside>
  );
}
