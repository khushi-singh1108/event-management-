import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

const CATEGORY_COLORS = {
  Technical: '#00f5ff', 'Annual Fest': '#ff006e', Internship: '#ffd60a',
  Sports: '#06d6a0', Workshop: '#8338ec', Educational: '#ffd60a',
  Entertainment: '#ff006e', Community: '#06d6a0',
};

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(13,17,23,0.8)', border: `1px solid ${color}25`,
      borderRadius: 14, padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800, color, marginBottom: 4, textShadow: `0 0 20px ${color}50` }}>{value}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{label}</div>
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

function Spinner({ color = '#00f5ff' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${color}30`, borderTop: `3px solid ${color}`, animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

const CATS = ['All', 'Technical', 'Sports', 'Workshop', 'Community', 'Entertainment'];

export default function StudentDashboard({ setPage }) {
  const { user, updateProfile } = useAuth();
  const [section, setSection]   = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [catFilter, setCatFilter] = useState('All');

  // Data states
  const [allEvents, setAllEvents]     = useState([]);
  const [myEvents, setMyEvents]       = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [certificates, setCertificates]   = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Profile edit
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileMsg, setProfileMsg]   = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoadingEvents(true);
    try {
      const [evts, myEvts, notifs, certs] = await Promise.all([
        api.events.getAll(),
        api.events.getMyEvents(),
        api.users.getNotifications(),
        api.users.getCertificates(),
      ]);
      setAllEvents(evts);
      setMyEvents(myEvts);
      setNotifications(notifs);
      setCertificates(certs);
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleRegister = async (id) => {
    const event = allEvents.find(e => e.id === id) || myEvents.find(e => e.id === id);
    if (!event) return;
    try {
      if (event.registered) {
        await api.events.unregister(id);
      } else {
        await api.events.register(id);
      }
      // Refresh
      const [evts, myEvts, notifs] = await Promise.all([
        api.events.getAll(),
        api.events.getMyEvents(),
        api.users.getNotifications(),
      ]);
      setAllEvents(evts);
      setMyEvents(myEvts);
      setNotifications(notifs);
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const markRead = async (id) => {
    await api.users.markRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (e) {
      setProfileMsg('Failed to update profile.');
    }
  };

  const upcoming = allEvents.filter(e => e.status === 'Upcoming');
  const ongoing  = allEvents.filter(e => e.status === 'Ongoing');
  const past     = allEvents.filter(e => e.status === 'Past');
  const filteredUpcoming = catFilter === 'All' ? upcoming : upcoming.filter(e => e.category === catFilter);
  const unreadCount = notifications.filter(n => !n.read).length;
  const myRegisteredUpcoming = myEvents.filter(e => e.status === 'Upcoming').length;
  const myRegisteredOngoing  = myEvents.filter(e => e.status === 'Ongoing').length;

  const renderSection = () => {
    if (loadingEvents && ['myevents','upcoming','ongoing','past','certificates'].includes(section)) {
      return <Spinner />;
    }
    switch (section) {
      case 'overview':
        return (
          <div>
            <SectionTitle>Overview Dashboard</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon="🎫" label="Registered Events"  value={myEvents.length}          color="#00f5ff" />
              <StatCard icon="🚀" label="Upcoming"           value={myRegisteredUpcoming}      color="#8338ec" />
              <StatCard icon="🔴" label="Ongoing"            value={myRegisteredOngoing}       color="#06d6a0" />
              <StatCard icon="🏆" label="Certificates"       value={certificates.length}       color="#ffd60a" />
            </div>
            <SectionTitle color="#8338ec">My Recent Registrations</SectionTitle>
            {loadingEvents ? <Spinner /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
                {myEvents.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} onClick={setSelectedEvent} compact />
                ))}
              </div>
            )}
            <SectionTitle color="#ffd60a">Quick Profile</SectionTitle>
            <div style={{
              background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.15)',
              borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron, sans-serif', fontSize: 24, color: '#030712', fontWeight: 800, flexShrink: 0,
              }}>{user?.name?.[0]}</div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, color: '#fff', marginBottom: 4 }}>{user?.name}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{user?.dept}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                  {user?.cgpa && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ffd60a' }}>CGPA: {user.cgpa}</span>}
                  {user?.roll_no && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00f5ff' }}>{user.roll_no}</span>}
                  {user?.year && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8338ec' }}>{user.year}</span>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'myevents':
        return (
          <div>
            <SectionTitle>My Registered Events ({myEvents.length})</SectionTitle>
            {myEvents.length === 0
              ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48 }}>🎫</div><p style={{ fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>No registrations yet. Explore events!</p></div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {myEvents.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
                </div>
            }
          </div>
        );

      case 'upcoming':
        return (
          <div>
            <SectionTitle color="#8338ec">Upcoming Events</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} style={{
                  padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
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
            <SectionTitle color="#06d6a0">Ongoing Events ({ongoing.length})</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {ongoing.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'past':
        return (
          <div>
            <SectionTitle color="rgba(255,255,255,0.5)">Past Events ({past.length})</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {past.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div>
            <SectionTitle color="#ffd60a">Certificates ({certificates.length})</SectionTitle>
            {certificates.length === 0
              ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48 }}>🏆</div><p style={{ fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Complete past events to earn certificates!</p></div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {certificates.map(cert => {
                    const catColor = CATEGORY_COLORS[cert.category] || '#ffd60a';
                    return (
                      <div key={cert.registration_id} style={{
                        background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.2)',
                        borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 50, height: 50, borderRadius: 10, background: `${catColor}20`, border: `1px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cert.poster}</div>
                          <div>
                            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: '#fff', marginBottom: 4 }}>{cert.title}</div>
                            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{cert.date} · {cert.organizer}</div>
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
                </div>
            }
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ height: 3, width: 32, background: 'linear-gradient(90deg, #00f5ff, transparent)' }} />
                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Notifications</h2>
                {unreadCount > 0 && <span style={{ background: '#ff006e', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700 }}>{unreadCount}</span>}
              </div>
              {unreadCount > 0 && (
                <button onClick={async () => { await api.users.markAllRead(); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }} style={{
                  background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 8,
                  padding: '6px 14px', color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, cursor: 'pointer',
                }}>Mark all read</button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map(notif => (
                <div key={notif.id} onClick={() => markRead(notif.id)} style={{
                  background: notif.read ? 'rgba(13,17,23,0.6)' : 'rgba(0,245,255,0.06)',
                  border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(0,245,255,0.2)'}`,
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{notif.type === 'reminder' ? '⏰' : notif.type === 'confirmation' ? '✅' : notif.type === 'announcement' ? '📢' : '🏅'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: notif.read ? 'rgba(255,255,255,0.6)' : '#fff', margin: '0 0 4px', fontWeight: notif.read ? 400 : 600 }}>{notif.message}</p>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(notif.created_at).toLocaleString('en-IN')}</span>
                  </div>
                  {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f5ff', flexShrink: 0, marginTop: 4, boxShadow: '0 0 8px #00f5ff' }} />}
                </div>
              ))}
              {notifications.length === 0 && <div style={{ textAlign: 'center', padding: 60, fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.3)' }}>No notifications yet</div>}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <SectionTitle color="#ffd60a">Student Profile</SectionTitle>
            {profileMsg && <div style={{ background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: '#06d6a0' }}>✓ {profileMsg}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720 }}>
              <div style={{ gridColumn: '1 / -1', background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,215,10,0.15)', borderRadius: 16, padding: '24px', display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #00f5ff, #8338ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: 30, fontWeight: 800, color: '#030712', flexShrink: 0 }}>{user?.name?.[0]}</div>
                <div>
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, color: '#fff', margin: '0 0 6px' }}>{user?.name}</h3>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: '0 0 10px' }}>{user?.dept}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {user?.year && <span style={{ background: 'rgba(131,56,236,0.15)', border: '1px solid rgba(131,56,236,0.3)', color: '#8338ec', borderRadius: 6, padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{user.year}</span>}
                    {user?.roll_no && <span style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)', color: '#00f5ff', borderRadius: 6, padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{user.roll_no}</span>}
                    {user?.cgpa && <span style={{ background: 'rgba(255,215,10,0.1)', border: '1px solid rgba(255,215,10,0.25)', color: '#ffd60a', borderRadius: 6, padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>CGPA {user.cgpa}</span>}
                  </div>
                </div>
              </div>
              {[
                { label: 'Full Name', value: user?.name, key: 'name', icon: '👤' },
                { label: 'Email', value: user?.email, icon: '📧' },
                { label: 'Department', value: user?.dept, key: 'dept', icon: '🏫' },
                { label: 'Year', value: user?.year, key: 'year', icon: '📅' },
                { label: 'Roll Number', value: user?.roll_no, key: 'roll_no', icon: '🎓' },
                { label: 'CGPA', value: user?.cgpa, key: 'cgpa', icon: '⭐' },
              ].map(field => (
                <div key={field.label} style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{field.icon} {field.label}</div>
                  {editingProfile && field.key ? (
                    <input
                      defaultValue={field.value}
                      onChange={e => setProfileForm(f => ({ ...f, [field.key]: field.key === 'cgpa' ? parseFloat(e.target.value) : e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: '#fff', fontWeight: 600 }}>{field.value ?? '—'}</div>
                  )}
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                {editingProfile ? (
                  <>
                    <button onClick={handleProfileSave} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #00f5ff, #8338ec)', border: 'none', borderRadius: 8, color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>💾 SAVE</button>
                    <button onClick={() => setEditingProfile(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setEditingProfile(true)} style={{ padding: '12px 24px', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 8, color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✏ Edit Profile</button>
                )}
              </div>
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
        <div style={{ background: 'rgba(13,17,23,0.9)', borderBottom: '1px solid rgba(0,245,255,0.1)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginRight: 8 }}>Dashboard /</span>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: '#00f5ff', textTransform: 'capitalize' }}>{section}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, padding: '6px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#00f5ff' }}>
              👤 {user?.name}
            </div>
            <button onClick={() => setPage('landing')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>← Home</button>
          </div>
        </div>
        <div style={{ padding: '28px 28px', overflowX: 'hidden' }}>
          {renderSection()}
        </div>
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onRegister={handleRegister} />}
    </div>
  );
}
