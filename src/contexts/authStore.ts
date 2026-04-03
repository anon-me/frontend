'use client';

import { create } from 'zustand';
import { User, UserStats } from '@/types';
import { authApi } from '@/services/api';

interface AuthState {
  user: User | null;
  stats: UserStats | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setStats: (stats: UserStats) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  stats: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('notexa_token', token);
    localStorage.setItem('notexa_user', JSON.stringify(user));
    // Auto-generate unique username on first auth if not already set
    if (!localStorage.getItem('notexa_username_' + user.id)) {
      const base = user.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .join('_');
      const suffix = String(user.id).slice(-4).padStart(4, '0');
      const username = `${base}_${suffix}`;
      localStorage.setItem('notexa_username_' + user.id, username);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('notexa_user', JSON.stringify(user));
    set({ user });
  },

  setStats: (stats) => set({ stats }),

  fetchMe: async () => {
    try {
      const res = await authApi.me();
      const { user, stats } = res.data;
      set({ user, stats, isAuthenticated: true, isLoading: false });
      localStorage.setItem('notexa_user', JSON.stringify(user));
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('notexa_token');
      localStorage.removeItem('notexa_user');
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('notexa_token');
    localStorage.removeItem('notexa_user');
    set({ user: null, token: null, stats: null, isAuthenticated: false });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('notexa_token');
    const userStr = localStorage.getItem('notexa_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
        // Refresh in background
        get().fetchMe();
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
