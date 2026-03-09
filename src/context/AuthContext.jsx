import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const USERS = {
  'student@university.edu': { password: 'student123', role: 'student' },
  'admin@university.edu': { password: 'admin123', role: 'admin' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = (email, password) => {
    const found = USERS[email];
    if (found && found.password === password) {
      setUser({ email, role: found.role });
      setLoginError('');
      return true;
    }
    setLoginError('Invalid email or password. Please try again.');
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
