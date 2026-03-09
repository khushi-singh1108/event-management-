import React, { useState } from 'react';
import { eventsData } from '../data/events';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Technical', 'Sports', 'Workshop', 'Educational', 'Entertainment', 'Annual Fest', 'Community', 'Internship'];
const STATUSES = ['All', 'Upcoming', 'Ongoing', 'Past'];

export default function EventsPage({ setPage }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(eventsData);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || e.category === category;
    const matchStatus = status === 'All' || e.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const handleRegister = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registered: !e.registered, participants: e.registered ? e.participants - 1 : e.participants + 1 } : e));
    setSelectedEvent(prev => prev && prev.id === id ? { ...prev, registered: !prev.registered } : prev);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingTop: 64 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(13,17,23,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px 32px',
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ height: 3, width: 40, background: 'linear-gradient(90deg, #00f5ff, transparent)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00f5ff', letterSpacing: 2 }}>EXPLORE</span>
          </div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
            All <span style={{ color: '#00f5ff' }}>Events</span>
          </h1>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Discover {eventsData.length} events across all categories
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events by title, description..."
            aria-label="Search events"
            style={{
              width: '100%', padding: '14px 20px 14px 48px', boxSizing: 'border-box',
              background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 15, outline: 'none',
              backdropFilter: 'blur(10px)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: status === s
                ? (s === 'Upcoming' ? 'rgba(0,245,255,0.2)' : s === 'Ongoing' ? 'rgba(6,214,160,0.2)' : s === 'Past' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.15)')
                : 'rgba(255,255,255,0.06)',
              border: `1px solid ${status === s ? (s === 'Upcoming' ? 'rgba(0,245,255,0.5)' : s === 'Ongoing' ? 'rgba(6,214,160,0.5)' : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.08)'}`,
              color: status === s ? (s === 'Upcoming' ? '#00f5ff' : s === 'Ongoing' ? '#06d6a0' : '#fff') : 'rgba(255,255,255,0.55)',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
            }}>{s}</button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: category === cat ? 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(131,56,236,0.2))' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${category === cat ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              color: category === cat ? '#00f5ff' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 600,
            }}>{cat}</button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#00f5ff' }}>{filtered.length}</span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>events found</span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(event => (
              <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔭</div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>No events found</h3>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer setPage={setPage} />

      {selectedEvent && (
        <EventDetailModal
          event={events.find(e => e.id === selectedEvent.id) || selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
