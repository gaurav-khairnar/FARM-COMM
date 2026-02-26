"use client";

export const authStorage = {
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  getUser() {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },
  setSession({ token, user }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
