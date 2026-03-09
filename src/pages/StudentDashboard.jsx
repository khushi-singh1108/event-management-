import React, { useState } from 'react';
import { eventsData, studentData } from '../data/events';
import DashboardSidebar from '../components/DashboardSidebar';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

const CATEGORY_COLORS = {
  Technical: '#00f5ff', 'Annual Fest': '#ff006e', Internship: '#ffd60a',
  Sports: '#06d6a0', Workshop: '#8338ec', Educational: '#ffd60a',
  Entertainment: '#ff006e', Community: '#06d6a0',
};

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'rgba(13,17,23,0.8)', border: `1px solid ${color}25`,
      borderRadius: 14, padding: '20px', backdropFilter: 'blur(10px)',
      boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800, color, marginBottom: 4, textShadow: `0 0 20px ${color}50` }}>{value}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children, color = '#00f5ff' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ height: 3, width: 32, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{children}</h2>
    </div>
  );
}

export default function StudentDashboard({ setPage }) {
  const [section, setSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(eventsData);
  const [catFilter, setCatFilter] = useState('All');
  const [notifications, setNotifications] = useState(studentData.notifications);

  const myEventIds = studentData.registeredEvents;
  const myEvents = events.filter(e => myEventIds.includes(e.id));
  const upcoming = events.filter(e => e.status === 'Upcoming');
  const ongoing = events.filter(e => e.status === 'Ongoing');
  const past = events.filter(e => e.status === 'Past');
  const certIds = studentData.certificates;
  const certEvents = events.filter(e => certIds.includes(e.id));
  const unreadCount = notifications.filter(n => !n.read).length;

  const CATS = ['All', 'Technical', 'Sports', 'Workshop', 'Community', 'Entertainment'];
  const filteredUpcoming = catFilter === 'All' ? upcoming : upcoming.filter(e => e.category === catFilter);

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return (
          <div>
            <SectionTitle>Overview Dashboard</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon="🎫" label="Registered Events" value={myEvents.length} color="#00f5ff" />
              <StatCard icon="🚀" label="Upcoming Events" value={upcoming.filter(e => myEventIds.includes(e.id)).length} color="#8338ec" />
              <StatCard icon="🔴" label="Ongoing" value={ongoing.filter(e => myEventIds.includes(e.id)).length} color="#06d6a0" />
              <StatCard icon="🏆" label="Certificates" value={certIds.length} color="#ffd60a" />
            </div>

            {/* Recent registrations */}
            <SectionTitle color="#8338ec">Recent Registrations</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
              {myEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} event={event} onClick={setSelectedEvent} compact />
              ))}
            </div>

            {/* Profile preview */}
            <SectionTitle color="#ffd60a">Quick Profile</SectionTitle>
            <div style={{
              background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.15)',
              borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron, sans-serif', fontSize: 24, fontWeight: 800, color: '#030712',
                flexShrink: 0,
              }}>{studentData.name[0]}</div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, color: '#fff', marginBottom: 4 }}>{studentData.name}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{studentData.dept}</div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ffd60a' }}>CGPA: {studentData.cgpa}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00f5ff' }}>{studentData.rollNo}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8338ec' }}>{studentData.year}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'myevents':
        return (
          <div>
            <SectionTitle>My Registered Events</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {myEvents.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div>
            <SectionTitle color="#8338ec">Upcoming Events</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: catFilter === cat ? 'rgba(131,56,236,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${catFilter === cat ? 'rgba(131,56,236,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: catFilter === cat ? '#8338ec' : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 600,
                }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredUpcoming.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'ongoing':
        return (
          <div>
            <SectionTitle color="#06d6a0">Ongoing Events</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {ongoing.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'past':
        return (
          <div>
            <SectionTitle color="rgba(255,255,255,0.5)">Past Events</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {past.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div>
            <SectionTitle color="#ffd60a">Certificates Earned</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {certEvents.map(event => {
                const catColor = CATEGORY_COLORS[event.category] || '#ffd60a';
                return (
                  <div key={event.id} style={{
                    background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.2)',
                    borderRadius: 14, padding: '18px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 10,
                        background: `${catColor}20`, border: `1px solid ${catColor}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                      }}>{event.poster}</div>
                      <div>
                        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: '#fff', marginBottom: 4 }}>{event.title}</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} · {event.organizer}
                        </div>
                      </div>
                    </div>
                    <button style={{
                      padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #ffd60a, #ff006e)',
                      color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    }}>⬇ DOWNLOAD</button>
                  </div>
                );
              })}
              {certEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>No certificates yet. Attend events to earn certificates!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ height: 3, width: 32, background: 'linear-gradient(90deg, #00f5ff, transparent)' }} />
                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Notifications</h2>
                {unreadCount > 0 && (
                  <span style={{ background: '#ff006e', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700 }}>{unreadCount}</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map(notif => (
                <div key={notif.id} onClick={() => markRead(notif.id)} style={{
                  background: notif.read ? 'rgba(13,17,23,0.6)' : 'rgba(0,245,255,0.06)',
                  border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(0,245,255,0.2)'}`,
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>
                    {notif.type === 'reminder' ? '⏰' : notif.type === 'confirmation' ? '✅' : notif.type === 'announcement' ? '📢' : '🏅'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: notif.read ? 'rgba(255,255,255,0.6)' : '#fff', margin: '0 0 4px', fontWeight: notif.read ? 400 : 600 }}>{notif.message}</p>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{notif.time}</span>
                  </div>
                  {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f5ff', flexShrink: 0, marginTop: 4, boxShadow: '0 0 8px #00f5ff' }} />}
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <SectionTitle color="#ffd60a">Student Profile</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720 }}>
              <div style={{ gridColumn: '1 / -1', background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.15)', borderRadius: 16, padding: '24px', display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Orbitron, sans-serif', fontSize: 30, fontWeight: 800, color: '#030712', flexShrink: 0,
                  boxShadow: '0 0 30px rgba(0,245,255,0.3)',
                }}>{studentData.name[0]}</div>
                <div>
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, color: '#fff', margin: '0 0 6px' }}>{studentData.name}</h3>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: '0 0 10px' }}>{studentData.dept}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: studentData.year, color: '#8338ec' },
                      { label: studentData.rollNo, color: '#00f5ff' },
                      { label: `CGPA ${studentData.cgpa}`, color: '#ffd60a' },
                    ].map(tag => (
                      <span key={tag.label} style={{ background: `${tag.color}15`, border: `1px solid ${tag.color}30`, color: tag.color, borderRadius: 6, padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{tag.label}</span>
                    ))}
                  </div>
                </div>
              </div>
              {[
                { label: 'Full Name', value: studentData.name, icon: '👤' },
                { label: 'Email', value: studentData.email, icon: '📧' },
                { label: 'Department', value: studentData.dept, icon: '🏫' },
                { label: 'Year of Study', value: studentData.year, icon: '📅' },
                { label: 'Roll Number', value: studentData.rollNo, icon: '🎓' },
                { label: 'CGPA', value: studentData.cgpa, icon: '⭐' },
              ].map(field => (
                <div key={field.label} style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{field.icon} {field.label}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: '#fff', fontWeight: 600 }}>{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingTop: 64, display: 'flex' }}>
      <DashboardSidebar role="student" activeSection={section} setSection={setSection} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          background: 'rgba(13,17,23,0.9)', borderBottom: '1px solid rgba(0,245,255,0.1)',
          padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginRight: 8 }}>Dashboard /</span>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: '#00f5ff', textTransform: 'capitalize' }}>{section}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#00f5ff',
            }}>👤 {studentData.name}</div>
            <button onClick={() => setPage('landing')} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)',
            }}>← Home</button>
          </div>
        </div>

        {/* Main */}
        <div style={{ padding: '28px 28px', overflowX: 'hidden' }}>
          {renderSection()}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
