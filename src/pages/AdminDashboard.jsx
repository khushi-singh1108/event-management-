import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

const CATEGORIES = ['Technical', 'Annual Fest', 'Internship', 'Sports', 'Workshop', 'Educational', 'Entertainment', 'Community'];
const CAT_ICONS = { Technical: '⚡', 'Annual Fest': '🎪', Internship: '💼', Sports: '🏏', Workshop: '🤖', Educational: '🎓', Entertainment: '🎭', Community: '🌱' };

function SectionTitle({ children, color = '#ff006e' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ height: 3, width: 32, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{children}</h2>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: 'rgba(13,17,23,0.8)', border: `1px solid ${color}25`, borderRadius: 14, padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800, color, marginBottom: 4, textShadow: `0 0 20px ${color}50` }}>{value ?? '—'}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,0,110,0.3)', borderTop: '3px solid #ff006e', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

const EMPTY_FORM = { title: '', category: 'Technical', date: '', time: '', venue: '', description: '', capacity: 100, tags: '', status: 'Upcoming', color: '#00f5ff', poster: '🎉' };

export default function AdminDashboard({ setPage }) {
  const { user } = useAuth();
  const [section, setSection]   = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Data
  const [events, setEvents]           = useState([]);
  const [stats, setStats]             = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading]         = useState(true);

  // Form
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formMsg, setFormMsg]         = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [evts, st, notifs] = await Promise.all([
        api.events.getAll(),
        api.admin.getStats(),
        api.users.getNotifications(),
      ]);
      setEvents(evts);
      setStats(st);
      setNotifications(notifs);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.events.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      setDeleteConfirm(null);
      const st = await api.admin.getStats();
      setStats(st);
    } catch (e) { alert(e.message); }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title, category: event.category, date: event.date,
      time: event.time, venue: event.venue, description: event.description,
      capacity: event.capacity, tags: (event.tags || []).join(', '),
      status: event.status, color: event.color, poster: event.poster,
    });
    setSection('create');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, capacity: Number(form.capacity), tags };
    try {
      if (editingEvent) {
        const updated = await api.events.update(editingEvent.id, payload);
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updated : ev));
        setFormMsg('Event updated successfully!');
      } else {
        const created = await api.events.create(payload);
        setEvents(prev => [created, ...prev]);
        setFormMsg('Event created successfully!');
      }
      const st = await api.admin.getStats();
      setStats(st);
      setForm(EMPTY_FORM);
      setEditingEvent(null);
      setTimeout(() => setFormMsg(''), 3000);
    } catch (err) {
      setFormMsg(`Error: ${err.message}`);
    }
  };

  const loadRegistrations = async (eventId) => {
    if (registrations[eventId]) return;
    try {
      const data = await api.events.getRegistrations(eventId);
      setRegistrations(prev => ({ ...prev, [eventId]: data }));
    } catch (e) { console.error(e); }
  };

  const upcoming = events.filter(e => e.status === 'Upcoming');
  const ongoing  = events.filter(e => e.status === 'Ongoing');
  const past     = events.filter(e => e.status === 'Past');
  const unreadCount = notifications.filter(n => !n.read).length;

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, outline: 'none',
  };
  const labelStyle = {
    display: 'block', fontFamily: 'Rajdhani, sans-serif', fontSize: 11,
    color: 'rgba(255,255,255,0.45)', marginBottom: 7, letterSpacing: 1, textTransform: 'uppercase',
  };

  const renderSection = () => {
    if (loading && section === 'overview') return <Spinner />;
    switch (section) {
      case 'overview':
        return (
          <div>
            <SectionTitle>Admin Analytics</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon="📋" label="Total Events"        value={stats?.total_events}        color="#ff006e" />
              <StatCard icon="👥" label="Total Participants"  value={stats?.total_participants}   color="#00f5ff" />
              <StatCard icon="🎓" label="Total Students"      value={stats?.total_users}          color="#8338ec" />
              <StatCard icon="🚀" label="Upcoming"            value={stats?.upcoming_count}       color="#8338ec" />
              <StatCard icon="🔴" label="Ongoing"             value={stats?.ongoing_count}        color="#06d6a0" />
              <StatCard icon="📚" label="Past Events"         value={stats?.past_count}           color="#ffd60a" />
            </div>
            <SectionTitle color="#00f5ff">Category Breakdown</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
              {CATEGORIES.map(cat => {
                const count = events.filter(e => e.category === cat).length;
                const ppts  = events.filter(e => e.category === cat).reduce((s, e) => s + e.participants, 0);
                return (
                  <div key={cat} style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{CAT_ICONS[cat]}</span>
                    <div>
                      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#fff', marginBottom: 2 }}>{cat}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#ff006e' }}>{count} events · {ppts} participants</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <SectionTitle color="#8338ec">Recent Events</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {events.slice(0, 4).map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} compact />)}
            </div>
          </div>
        );

      case 'allevents':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <SectionTitle>All Events ({events.length})</SectionTitle>
              <button onClick={() => { setEditingEvent(null); setForm(EMPTY_FORM); setSection('create'); }} style={{ background: 'linear-gradient(135deg, #ff006e, #8338ec)', border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ CREATE EVENT</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,0,110,0.08)', borderBottom: '1px solid rgba(255,0,110,0.2)' }}>
                    {['Event', 'Category', 'Date', 'Status', 'Registrations', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: '#ff006e', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, i) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{event.poster}</span>
                          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: '#fff', fontWeight: 600 }}>{event.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{event.category}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ color: event.status === 'Upcoming' ? '#00f5ff' : event.status === 'Ongoing' ? '#06d6a0' : 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 700 }}>{event.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ff006e' }}>{event.participants}/{event.capacity}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleEdit(event)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.1)', color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(event.id)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,0,110,0.3)', background: 'rgba(255,0,110,0.1)', color: '#ff006e', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'create':
        return (
          <div style={{ maxWidth: 700 }}>
            <SectionTitle color="#ff006e">{editingEvent ? 'Edit Event' : 'Create New Event'}</SectionTitle>
            {formMsg && <div style={{ background: formMsg.startsWith('Error') ? 'rgba(255,0,110,0.1)' : 'rgba(6,214,160,0.1)', border: `1px solid ${formMsg.startsWith('Error') ? 'rgba(255,0,110,0.3)' : 'rgba(6,214,160,0.3)'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: formMsg.startsWith('Error') ? '#ff006e' : '#06d6a0' }}>{formMsg.startsWith('Error') ? '⚠' : '✓'} {formMsg}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Event Title *</label>
                  <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Annual Tech Fest 2026" required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {['Upcoming', 'Ongoing', 'Past'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Capacity *</label>
                  <input style={inputStyle} type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} min={1} required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Event Date *</label>
                  <input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Event Time *</label>
                  <input style={inputStyle} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 10:00 AM" required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Poster Emoji</label>
                  <input style={inputStyle} value={form.poster} onChange={e => setForm(f => ({ ...f, poster: e.target.value }))} placeholder="🎉" maxLength={4} onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Venue *</label>
                  <input style={inputStyle} value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. Main Auditorium, Block A" required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the event..." required onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Tags (comma-separated)</label>
                  <input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. Hackathon, Coding, AI/ML" onFocus={e => e.target.style.borderColor = 'rgba(255,0,110,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #ff006e, #8338ec)', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1, boxShadow: '0 0 30px rgba(255,0,110,0.3)' }}>{editingEvent ? '💾 SAVE CHANGES' : '🚀 CREATE EVENT'}</button>
                {editingEvent && <button type="button" onClick={() => { setEditingEvent(null); setForm(EMPTY_FORM); }} style={{ padding: '13px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, cursor: 'pointer' }}>Cancel</button>}
              </div>
            </form>
          </div>
        );

      case 'registered':
        return (
          <div>
            <SectionTitle>Student Registrations</SectionTitle>
            {events.map(event => {
              const regs = registrations[event.id];
              return (
                <div key={event.id} style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{event.poster}</span>
                      <div>
                        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, color: '#fff' }}>{event.title}</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{event.category} · {event.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#ff006e' }}>{event.participants} registered</span>
                      {!regs && <button onClick={() => loadRegistrations(event.id)} style={{ padding: '5px 12px', background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: 6, color: '#ff006e', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer' }}>View List</button>}
                    </div>
                  </div>
                  {regs && (
                    <div style={{ padding: '12px 20px' }}>
                      {regs.length === 0
                        ? <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No registrations yet</p>
                        : <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead><tr>{['Name', 'Roll No', 'Dept', 'Email', 'Registered At', 'Attended'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{h}</th>)}</tr></thead>
                              <tbody>
                                {regs.map(r => (
                                  <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td style={{ padding: '8px 12px', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#fff' }}>{r.user.name}</td>
                                    <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#00f5ff' }}>{r.user.roll_no || '—'}</td>
                                    <td style={{ padding: '8px 12px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{r.user.dept || '—'}</td>
                                    <td style={{ padding: '8px 12px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{r.user.email}</td>
                                    <td style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(r.registered_at).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding: '8px 12px' }}>
                                      <button onClick={() => api.events.markAttended(event.id, r.id).then(() => loadRegistrations(event.id))} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer', background: r.attended ? 'rgba(6,214,160,0.2)' : 'rgba(255,255,255,0.08)', color: r.attended ? '#06d6a0' : 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani, sans-serif', fontSize: 11 }}>
                                        {r.attended ? '✓ Yes' : 'Mark'}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'upcoming':
        return (
          <div>
            <SectionTitle>Upcoming Events ({upcoming.length})</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {upcoming.map(event => (
                <div key={event.id}>
                  <EventCard event={event} onClick={setSelectedEvent} />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button onClick={() => handleEdit(event)} style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid rgba(0,245,255,0.25)', background: 'rgba(0,245,255,0.08)', color: '#00f5ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(event.id)} style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid rgba(255,0,110,0.25)', background: 'rgba(255,0,110,0.08)', color: '#ff006e', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ongoing':
        return (
          <div>
            <SectionTitle color="#06d6a0">Live Events ({ongoing.length})</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {ongoing.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'past':
        return (
          <div>
            <SectionTitle color="rgba(255,255,255,0.4)">Past Events ({past.length})</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {past.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ height: 3, width: 32, background: 'linear-gradient(90deg, #ff006e, transparent)' }} />
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Notifications</h2>
              {unreadCount > 0 && <span style={{ background: '#ff006e', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700 }}>{unreadCount}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{ background: notif.read ? 'rgba(13,17,23,0.6)' : 'rgba(255,0,110,0.06)', border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(255,0,110,0.2)'}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{notif.type === 'alert' ? '🚨' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: notif.read ? 'rgba(255,255,255,0.6)' : '#fff', margin: '0 0 4px', fontWeight: notif.read ? 400 : 600 }}>{notif.message}</p>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(notif.created_at).toLocaleString('en-IN')}</span>
                  </div>
                  {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff006e', boxShadow: '0 0 8px #ff006e', flexShrink: 0, marginTop: 4 }} />}
                </div>
              ))}
              {notifications.length === 0 && <div style={{ textAlign: 'center', padding: 60, fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.3)' }}>No notifications</div>}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingTop: 64, display: 'flex' }}>
      <DashboardSidebar role="admin" activeSection={section} setSection={setSection} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: 'rgba(13,17,23,0.9)', borderBottom: '1px solid rgba(255,0,110,0.1)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginRight: 8 }}>Admin /</span>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, color: '#ff006e', textTransform: 'capitalize' }}>{section}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: 8, padding: '6px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#ff006e' }}>🛠️ {user?.name}</div>
            <button onClick={() => setPage('landing')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>← Home</button>
          </div>
        </div>
        <div style={{ padding: '28px 28px', overflowX: 'auto' }}>{renderSection()}</div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div onClick={() => setDeleteConfirm(null)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(13,17,23,0.98)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: 16, padding: '32px', maxWidth: 400, width: '90%' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, color: '#ff006e', marginBottom: 12 }}>⚠ Delete Event?</div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>This action is permanent and will remove all registrations.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '11px', background: '#ff006e', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>DELETE</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
