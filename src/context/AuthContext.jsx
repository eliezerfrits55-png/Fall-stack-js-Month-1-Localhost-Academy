/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromStorage } from '../data/seed';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('mbeccul_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const login = (email, password) => {
    const data = getFromStorage();
    const foundUser = data.users.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Ne pas stocker le mot de passe dans le contexte
    const { password: storedPassword, ...userWithoutPassword } = foundUser;
    void storedPassword;
    setUser(userWithoutPassword);
    localStorage.setItem('mbeccul_user', JSON.stringify(userWithoutPassword));

    // Redirection selon le rôle
    if (foundUser.role === 'client') {
      navigate('/client/dashboard');
    } else {
      navigate('/dashboard');
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mbeccul_user');
    navigate('/login');
  };

  // Helpers exposés
  const isAdmin = () => user?.role === 'admin';
  const isManager = () => user?.role === 'manager';
  const isClient = () => user?.role === 'client';
  const hasRole = (roles) => roles.includes(user?.role);

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
    isManager,
    isClient,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};