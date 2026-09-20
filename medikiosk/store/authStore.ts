import { create } from 'zustand';

export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: 'Clinical Administrator' | 'Consultant Doctor';
  clinicName: string;
  room: string;
  specialization?: string;
  phone?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AdminUser | null;
  login: (email: string, password: string, role?: 'Clinical Administrator' | 'Consultant Doctor') => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    clinicName?: string,
    role?: 'Clinical Administrator' | 'Consultant Doctor'
  ) => Promise<boolean>;
  updateUser: (data: Partial<AdminUser>) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

const STORAGE_KEY = 'medikiosk_auth_session';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isInitialized: false,
  user: null,

  login: async (email: string, password: string, role = 'Clinical Administrator') => {
    if (!email || !password) return false;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        return false;
      }

      const syncedUser: AdminUser = {
        id: json.data.id,
        name: json.data.name,
        email: json.data.email,
        role: json.data.role,
        clinicName: json.data.clinicName,
        room: json.data.room,
        specialization: json.data.specialization,
        phone: json.data.phone,
      };

      set({ isAuthenticated: true, user: syncedUser, isInitialized: true });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: syncedUser }));
        } catch (e) {
          console.error('Failed to save auth session', e);
        }
      }

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    clinicName = 'MediKiosk OPD Clinic',
    role = 'Clinical Administrator'
  ) => {
    if (!name || !email || !password) return false;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, clinicName, role }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        return false;
      }

      const registeredUser: AdminUser = {
        id: json.data.id,
        name: json.data.name,
        email: json.data.email,
        role: json.data.role,
        clinicName: json.data.clinicName,
        room: json.data.room,
        specialization: json.data.specialization,
        phone: json.data.phone,
      };

      set({ isAuthenticated: true, user: registeredUser, isInitialized: true });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: registeredUser }));
        } catch (e) {
          console.error('Failed to save auth session', e);
        }
      }

      return true;
    } catch (err) {
      console.error('Signup error:', err);
      return false;
    }
  },

  updateUser: async (data: Partial<AdminUser>) => {
    const current = get().user;
    if (!current) return;
    const updated: AdminUser = { ...current, ...data };
    set({ user: updated });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: get().isAuthenticated, user: updated }));
      } catch (e) {
        console.error('Failed to save updated user', e);
      }
    }

    // Sync changes with SQLite backend
    try {
      await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('User update sync error:', err);
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Failed to call logout API', e);
    }

    set({ isAuthenticated: false, user: null, isInitialized: true });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear auth session', e);
      }
    }
  },

  initAuth: async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const user: AdminUser = {
            id: json.data.id,
            name: json.data.name,
            email: json.data.email,
            role: json.data.role,
            clinicName: json.data.clinicName,
            room: json.data.room,
            specialization: json.data.specialization,
            phone: json.data.phone,
          };
          set({ isAuthenticated: true, user, isInitialized: true });
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user }));
          return;
        }
      }

      // If no valid server session, clear storage and unauthenticate
      localStorage.removeItem(STORAGE_KEY);
      set({ isAuthenticated: false, user: null, isInitialized: true });
    } catch (e) {
      console.error('Failed to initialize auth', e);
      set({ isAuthenticated: false, user: null, isInitialized: true });
    }
  },
}));
