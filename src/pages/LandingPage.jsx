import React, { useState, useEffect } from 'react';
import { eventsData } from '../data/events';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import Footer from '../components/Footer';

const CATEGORIES = [
  { icon: '🎓', label: 'Educational', color: '#ffd60a', desc: 'Seminars, talks & lectures' },
  { icon: '⚡', label: 'Technical', color: '#00f5ff', desc: 'Hackathons & workshops' },
  { icon: '💼', label: 'Internship', color: '#ff006e', desc: 'Industry drives & placements' },
  { icon: '🏏', label: 'Sports', color: '#06d6a0', desc: 'Tournaments & athletics' },
  { icon: '🎭', label: 'Entertainment', color: '#8338ec', desc: 'Shows & performances' },
  { icon: '🎪', label: 'Annual Fest', color: '#ff006e', desc: 'University-wide festivals' },
  { icon: '🌱', label: 'Community', color: '#06d6a0', desc: 'Social & volunteer events' },
];

const STATS = [
  { value: '120+', label: 'Events/Year', color: '#00f5ff' },
  { value: '8,500+', label: 'Students', color: '#ff006e' },
  { value: '45+', label: 'Clubs', color: '#8338ec' },
  { value: '30+', label: 'Awards Won', color: '#ffd60a' },
];

function TypewriterText({ texts }) {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const delay = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setTextIdx(i => (i + 1) % texts.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts]);

  return (
    <span style={{ color: '#00f5ff', textShadow: '0 0 30px rgba(0,245,255,0.6)' }}>
      {displayed}
      <span style={{ animation: 'blink 1s step-end infinite', opacity: 0.8 }}>_</span>
    </span>
  );
}

function CalendarStrip() {
  const today = new Date(2026, 2, 9);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const DAY_STR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasEvent = (date) =>
    eventsData.some(e => {
      const ed = new Date(e.date);
      return ed.toDateString() === date.toDateString();
    });

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
      {days.map((day, i) => {
        const hasEv = hasEvent(day);
        const isToday = i === 0;
        return (
          <div key={i} style={{
            background: isToday ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isToday ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12, padding: '12px 14px', textAlign: 'center', minWidth: 64,
            position: 'relative',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: isToday ? '#00f5ff' : 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              {DAY_STR[day.getDay()]}
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 700, color: isToday ? '#00f5ff' : '#fff' }}>
              {day.getDate()}
            </div>
            {hasEv && (
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: '#00f5ff',
                boxShadow: '0 0 8px rgba(0,245,255,0.8)', margin: '4px auto 0',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage({ setPage }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [catHovered, setCatHovered] = useState(null);
  const upcomingEvents = eventsData.filter(e => e.status === 'Upcoming');

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingTop: 64, overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', position: 'relative',
        backgroundImage: `
          radial-gradient(ellipse at 15% 50%, rgba(0,245,255,0.07) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, rgba(131,56,236,0.09) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 90%, rgba(255,0,110,0.05) 0%, transparent 50%),
          linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, auto, 50px 50px, 50px 50px',
      }}>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: ['#00f5ff', '#ff006e', '#8338ec', '#ffd60a'][i % 4],
            top: `${15 + i * 12}%`,
            left: `${5 + i * 15}%`,
            opacity: 0.4,
            boxShadow: `0 0 10px ${['#00f5ff', '#ff006e', '#8338ec', '#ffd60a'][i % 4]}`,
            animation: `float ${3 + i}s ease-in-out infinite alternate`,
          }} />
        ))}

        <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.25)',
            borderRadius: 40, padding: '8px 20px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06d6a0', boxShadow: '0 0 10px #06d6a0', animation: 'pulse-glow 1.5s infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(0,245,255,0.9)', letterSpacing: 1 }}>
              CSMU · UNIVERSITY EVENT HUB · 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(28px, 6vw, 64px)',
            fontWeight: 900, lineHeight: 1.1,
            color: '#fff', margin: '0 0 16px',
            letterSpacing: '-1px',
          }}>
            Campus Event<br />
            <TypewriterText texts={['Management Portal', 'Excellence Hub', 'Innovation Center', 'Community Platform']} />
          </h1>

          <p style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7, margin: '0 auto 36px', maxWidth: 600,
          }}>
            Discover, register, and track every university event in one place.
            From hackathons to cultural fests — your complete campus activity hub.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage('events')} style={{
              padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
              color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
              boxShadow: '0 0 40px rgba(0,245,255,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >EXPLORE EVENTS →</button>
            <button onClick={() => setPage('login')} style={{
              padding: '14px 32px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.4)'; e.currentTarget.style.color = '#00f5ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
            >LOGIN →</button>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 26, fontWeight: 800,
                  color: stat.color, textShadow: `0 0 20px ${stat.color}60`,
                }}>{stat.value}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIQUIDMORPHISM divider */}
      <div style={{ height: 60, background: 'linear-gradient(180deg, #030712 0%, rgba(0,245,255,0.03) 50%, #030712 100%)', borderRadius: '50%/20px', marginBottom: 0 }} />

      {/* CATEGORY CARDS */}
      <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, transparent, #ff006e)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ff006e', letterSpacing: 2 }}>EXPLORE CATEGORIES</span>
            <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, #ff006e, transparent)' }} />
          </div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>
            Event <span style={{ color: '#ff006e' }}>Categories</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {CATEGORIES.map(cat => {
            const hovered = catHovered === cat.label;
            return (
              <div
                key={cat.label}
                onClick={() => setPage('events')}
                onMouseEnter={() => setCatHovered(cat.label)}
                onMouseLeave={() => setCatHovered(null)}
                style={{
                  background: hovered ? `${cat.color}15` : 'rgba(13,17,23,0.8)',
                  border: `1px solid ${hovered ? cat.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${cat.color}15` : '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{
                  fontSize: 40, marginBottom: 12,
                  filter: hovered ? `drop-shadow(0 0 12px ${cat.color}80)` : 'none',
                  transition: 'filter 0.3s',
                }}>{cat.icon}</div>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700,
                  color: hovered ? cat.color : '#fff', marginBottom: 8,
                  transition: 'color 0.3s',
                }}>{cat.label}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{cat.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section style={{
        padding: '60px 24px',
        background: 'rgba(13,17,23,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, transparent, #8338ec)' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8338ec', letterSpacing: 2 }}>UPCOMING</span>
              </div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>
                Don't Miss <span style={{ color: '#8338ec' }}>These</span>
              </h2>
            </div>
            <button onClick={() => setPage('events')} style={{
              background: 'none', border: '1px solid rgba(131,56,236,0.3)', borderRadius: 8,
              padding: '9px 20px', color: '#8338ec', cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600,
            }}>View All Events →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
            ))}
          </div>
        </div>
      </section>

      {/* CALENDAR STRIP */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, transparent, #06d6a0)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#06d6a0', letterSpacing: 2 }}>UPCOMING WEEK</span>
            <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, #06d6a0, transparent)' }} />
          </div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
            This Week's <span style={{ color: '#06d6a0' }}>Schedule</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Events with dots have activities scheduled
          </p>
        </div>
        <CalendarStrip />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => setPage('calendar')} style={{
            background: 'linear-gradient(135deg, rgba(6,214,160,0.2), rgba(131,56,236,0.2))',
            border: '1px solid rgba(6,214,160,0.3)', borderRadius: 8,
            padding: '10px 24px', color: '#06d6a0', cursor: 'pointer',
            fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600,
          }}>View Full Calendar →</button>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        margin: '0 24px 60px', borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(131,56,236,0.15) 50%, rgba(255,0,110,0.1) 100%)',
        border: '1px solid rgba(0,245,255,0.15)',
        padding: '48px', textAlign: 'center',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 30, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
            Ready to <span style={{ color: '#00f5ff' }}>Get Started?</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.6)', margin: '0 0 28px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Join 8,500+ students and never miss a campus event again. Sign in to track registrations, earn certificates, and more.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage('login')} style={{
              padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #00f5ff, #8338ec)',
              color: '#030712', fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: 1,
              boxShadow: '0 0 30px rgba(0,245,255,0.3)',
            }}>LOGIN AS STUDENT</button>
            <button onClick={() => setPage('events')} style={{
              padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', color: '#fff',
              fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1,
            }}>BROWSE EVENTS</button>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
