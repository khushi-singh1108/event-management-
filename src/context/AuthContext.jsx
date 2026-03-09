import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setToken, clearToken, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading]   = useState(true); // check stored token on mount

  // ── Restore session from localStorage ──────────────────────────
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.auth.me()
        .then(u => setUser(u))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Login ───────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoginError('');
    try {
      const data = await api.auth.login(email, password);
      setToken(data.access_token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password.');
      return { success: false };
    }
  };

  // ── Logout ──────────────────────────────────────────────────────
  const logout = () => {
    clearToken();
    setUser(null);
  };

  // ── Update profile ──────────────────────────────────────────────
  const updateProfile = async (payload) => {
    const updated = await api.auth.updateMe(payload);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, setLoginError, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
