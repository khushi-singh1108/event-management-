import React, { useState, useMemo } from 'react';
import { eventsData } from '../data/events';
import Footer from '../components/Footer';
import EventDetailModal from '../components/EventDetailModal';

const CATEGORY_COLORS = {
  Technical: '#00f5ff', 'Annual Fest': '#ff006e', Internship: '#ffd60a',
  Sports: '#06d6a0', Workshop: '#8338ec', Educational: '#ffd60a',
  Entertainment: '#ff006e', Community: '#06d6a0',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage({ setPage }) {
  const today = new Date(2026, 2, 9); // March 9 2026
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map = {};
    eventsData.forEach(event => {
      const d = new Date(event.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate();
        if (!map[key]) map[key] = [];
        map[key].push(event);
      }
    });
    return map;
  }, [year, month]);

  const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingTop: 64 }}>
      <div style={{
        background: 'rgba(13,17,23,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px 32px',
        backgroundImage: 'linear-gradient(rgba(131,56,236,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(131,56,236,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ height: 3, width: 40, background: 'linear-gradient(90deg, #8338ec, transparent)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8338ec', letterSpacing: 2 }}>SCHEDULE</span>
          </div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 }}>
            Event <span style={{ color: '#8338ec' }}>Calendar</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Calendar */}
        <div style={{ flex: '1 1 500px' }}>
          {/* Month nav */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
            background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <button onClick={prevMonth} style={{
              background: 'rgba(131,56,236,0.15)', border: '1px solid rgba(131,56,236,0.3)',
              color: '#8338ec', borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              fontFamily: 'Orbitron, sans-serif', fontSize: 12,
            }}>←</button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>
                {MONTHS[month]} {year}
              </h2>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(131,56,236,0.7)' }}>
                {Object.keys(eventsByDate).length} events this month
              </span>
            </div>
            <button onClick={nextMonth} style={{
              background: 'rgba(131,56,236,0.15)', border: '1px solid rgba(131,56,236,0.3)',
              color: '#8338ec', borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              fontFamily: 'Orbitron, sans-serif', fontSize: 12,
            }}>→</button>
          </div>

          {/* Grid */}
          <div style={{
            background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(131,56,236,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {DAYS.map(day => (
                <div key={day} style={{
                  textAlign: 'center', padding: '12px 4px',
                  fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: '#8338ec', letterSpacing: 1,
                }}>{day}</div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((day, idx) => {
                const dayEvents = day ? (eventsByDate[day] || []) : [];
                const isSelected = day === selectedDate;
                const isTod = day && isToday(day);
                return (
                  <div
                    key={idx}
                    onClick={() => day && (setSelectedDate(day === selectedDate ? null : day))}
                    style={{
                      minHeight: 80, padding: '8px', borderRight: '1px solid rgba(255,255,255,0.04)',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isSelected ? 'rgba(131,56,236,0.15)' : isTod ? 'rgba(0,245,255,0.05)' : 'transparent',
                      cursor: day ? 'pointer' : 'default',
                      transition: 'background 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (day && !isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (day && !isSelected && !isTod) e.currentTarget.style.background = 'transparent'; else if (day && isTod && !isSelected) e.currentTarget.style.background = 'rgba(0,245,255,0.05)'; }}
                  >
                    {day && (
                      <>
                        <span style={{
                          fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: isTod ? 700 : 400,
                          color: isTod ? '#00f5ff' : isSelected ? '#8338ec' : 'rgba(255,255,255,0.7)',
                          display: 'block', marginBottom: 6,
                          ...(isTod ? {
                            background: 'rgba(0,245,255,0.2)', borderRadius: '50%',
                            width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(0,245,255,0.3)',
                          } : {}),
                        }}>{day}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {dayEvents.slice(0, 3).map(ev => (
                            <div key={ev.id} style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: CATEGORY_COLORS[ev.category] || '#00f5ff',
                              boxShadow: `0 0 4px ${CATEGORY_COLORS[ev.category] || '#00f5ff'}60`,
                            }} title={ev.title} />
                          ))}
                          {dayEvents.length > 3 && (
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}80` }} />
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ flex: '0 0 280px' }}>
          <div style={{
            background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '20px', position: 'sticky', top: 80,
          }}>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, color: '#8338ec', margin: '0 0 16px', letterSpacing: 1 }}>
              {selectedDate
                ? `${MONTHS[month].slice(0, 3)} ${selectedDate} — Events`
                : 'SELECT A DATE'}
            </h3>
            {!selectedDate ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Click on a date to see events</p>
              </div>
            ) : selectedDateEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🌌</div>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)', margin: 0 }}>No events on this day</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedDateEvents.map(event => {
                  const catColor = CATEGORY_COLORS[event.category] || '#00f5ff';
                  return (
                    <div key={event.id} onClick={() => setSelectedEvent(event)} style={{
                      background: `${catColor}10`, border: `1px solid ${catColor}30`,
                      borderRadius: 10, padding: '12px', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = `${catColor}20`}
                      onMouseLeave={e => e.currentTarget.style.background = `${catColor}10`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{event.poster}</span>
                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#fff', fontWeight: 700 }}>{event.title}</span>
                      </div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{event.time} · {event.venue}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{
                          background: `${catColor}20`, border: `1px solid ${catColor}40`, color: catColor,
                          borderRadius: 20, padding: '2px 8px', fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 700,
                        }}>{event.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming mini-list */}
          <div style={{ marginTop: 16, background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px' }}>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: '#00f5ff', margin: '0 0 14px', letterSpacing: 1 }}>NEXT 7 DAYS</h3>
            {eventsData
              .filter(e => e.status === 'Upcoming')
              .slice(0, 4)
              .map(event => {
                const catColor = CATEGORY_COLORS[event.category] || '#00f5ff';
                return (
                  <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 22 }}>{event.poster}</span>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#fff', fontWeight: 600 }}>{event.title}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: catColor }}>
                        {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
