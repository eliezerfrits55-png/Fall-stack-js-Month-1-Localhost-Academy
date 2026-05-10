import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = { name: 'Admin', email: 'admin@localhost.ac', role: 'Staff Manager' };
const USER_STORAGE_KEY = 'mbeccul_users';
const SESSION_STORAGE_KEY = 'mbeccul_user';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function loadStoredUsers() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  });

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail === 'admin@localhost.ac' && password === 'react123') {
      setUser(DEMO_USER);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(DEMO_USER));
      return true;
    }

    const storedUser = loadStoredUsers().find(
      (entry) => entry.email === normalizedEmail && entry.password === password
    );

    if (!storedUser) {
      return false;
    }

    const sessionUser = {
      name: storedUser.name,
      email: storedUser.email,
      role: storedUser.role,
    };

    setUser(sessionUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return true;
  };

  const signup = ({ name, email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const users = loadStoredUsers();

    if (normalizedEmail === 'admin@localhost.ac' || users.some((entry) => entry.email === normalizedEmail)) {
      return { ok: false, error: 'An account already exists with this email.' };
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'Member',
    };

    saveStoredUsers([...users, newUser]);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
