'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [familyProfile, setFamilyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('airaware_token');
      const storedUser = localStorage.getItem('airaware_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        fetchProfile(storedToken);
      }
    } catch (err) {
      console.warn('Failed to parse stored auth session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await api.get('/family/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.data.success) {
        setFamilyProfile(res.data.profile);
      }
    } catch (err) {
      // Profile fetch optional
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('airaware_token', newToken);
      localStorage.setItem('airaware_user', JSON.stringify(newUser));
      await fetchProfile(newToken);
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async ({ name, email, password, city }) => {
    const res = await api.post('/auth/register', { name, email, password, city });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('airaware_token', newToken);
      localStorage.setItem('airaware_user', JSON.stringify(newUser));
      await fetchProfile(newToken);
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const demoLogin = async () => {
    // Generate or login demo user
    const demoEmail = 'demo.eco@airaware.ai';
    const demoPassword = 'DemoPassword2026!';
    try {
      return await login(demoEmail, demoPassword);
    } catch (err) {
      // Register demo user if doesn't exist
      return await register({
        name: 'Alex Rivera (Demo)',
        email: demoEmail,
        password: demoPassword,
        city: 'Delhi',
      });
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/family/profile', profileData);
    if (res.data.success) {
      setFamilyProfile(res.data.profile);
      return res.data.profile;
    }
    throw new Error(res.data.message || 'Failed to update profile');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFamilyProfile(null);
    localStorage.removeItem('airaware_token');
    localStorage.removeItem('airaware_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        familyProfile,
        isAuthenticated: Boolean(token),
        loading,
        login,
        register,
        demoLogin,
        logout,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
