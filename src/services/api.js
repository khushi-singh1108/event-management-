const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Token helpers ───────────────────────────────────────────────
export const getToken = () => localStorage.getItem('csmu_token');
export const setToken = (t) => localStorage.setItem('csmu_token', t);
export const clearToken = () => localStorage.removeItem('csmu_token');

// ─── Core fetch wrapper ──────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.detail || `Request failed (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.map(e => e.msg).join(', ') : msg);
  }
  return data;
}

const get  = (path, opts) => request(path, { method: 'GET',    ...opts });
const post = (path, body, opts) => request(path, { method: 'POST',   body: JSON.stringify(body), ...opts });
const put  = (path, body, opts) => request(path, { method: 'PUT',    body: JSON.stringify(body), ...opts });
const del  = (path, opts)       => request(path, { method: 'DELETE', ...opts });
const patch = (path, body, opts) => request(path, { method: 'PATCH', body: JSON.stringify(body), ...opts });

// ─── AUTH ────────────────────────────────────────────────────────
export const api = {
  auth: {
    login:    (email, password) => post('/auth/login', { email, password }),
    register: (payload)         => post('/auth/register', payload),
    me:       ()                => get('/auth/me'),
    updateMe: (payload)         => put('/auth/me', payload),
  },

  // ─── EVENTS ─────────────────────────────────────────────────
  events: {
    getAll: (params = {}) => {
      const q = new URLSearchParams();
      if (params.category && params.category !== 'All') q.set('category', params.category);
      if (params.status   && params.status   !== 'All') q.set('status',   params.status);
      if (params.search)                                  q.set('search',   params.search);
      const qs = q.toString();
      // If user is logged in use authenticated endpoint to get 'registered' flag
      const path = getToken()
        ? `/events/all-authenticated${qs ? '?' + qs : ''}`
        : `/events/${qs ? '?' + qs : ''}`;
      return get(path);
    },
    getOne:    (id)     => get(`/events/${id}`),
    getMyEvents: ()     => get('/events/me'),
    create:    (payload) => post('/events/', payload),
    update:    (id, payload) => put(`/events/${id}`, payload),
    delete:    (id)     => del(`/events/${id}`),
    register:  (id)     => post(`/events/${id}/register`, {}),
    unregister:(id)     => del(`/events/${id}/register`),
    getRegistrations: (id) => get(`/events/${id}/registrations`),
    markAttended: (eventId, regId) => patch(`/events/${eventId}/registrations/${regId}/attend`, {}),
  },

  // ─── USERS ──────────────────────────────────────────────────
  users: {
    list:             ()   => get('/users/'),
    getNotifications: ()   => get('/users/me/notifications'),
    markRead:         (id) => put(`/users/me/notifications/${id}/read`, {}),
    markAllRead:      ()   => put('/users/me/notifications/read-all', {}),
    getCertificates:  ()   => get('/users/me/certificates'),
  },

  // ─── ADMIN ──────────────────────────────────────────────────
  admin: {
    getStats:  ()        => get('/admin/stats'),
    broadcast: (payload) => post('/admin/notifications/broadcast', payload),
  },
};

export default api;
