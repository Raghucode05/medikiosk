import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';
export type SidebarMode = 'expanded' | 'collapsed';

interface AppearanceState {
  theme: ThemeMode;
  density: DensityMode;
  sidebarMode: SidebarMode;
  resolvedTheme: 'light' | 'dark';
  textSize: number; // percentage (e.g. 100 = 100%, 110 = 110%)

  setTheme: (theme: ThemeMode) => void;
  setDensity: (density: DensityMode) => void;
  setSidebarMode: (mode: SidebarMode) => void;
  toggleSidebarMode: () => void;
  setTextSize: (size: number) => void;
  increaseTextSize: (step?: number) => void;
  decreaseTextSize: (step?: number) => void;
  resetTextSize: () => void;
  initAppearance: () => void;
}

const STORAGE_KEY = 'medikiosk_appearance_settings';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeDom(theme: ThemeMode): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    if (document.body) {
      document.body.classList.add('dark');
    }
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    if (document.body) {
      document.body.classList.remove('dark');
    }
  }

  return resolved;
}

function applyTextSizeDom(textSize: number) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const clampedSize = Math.max(70, Math.min(160, Math.round(textSize)));
  // 100% corresponds to 18px base root font size (or 19px on wide screens >= 1440px)
  const isWide = window.innerWidth >= 1440;
  const basePx = isWide ? 19 : 18;
  const calculatedPx = Math.round(((basePx * clampedSize) / 100) * 100) / 100;

  // Set with important priority so no stylesheet rule can override it
  root.style.setProperty('font-size', `${calculatedPx}px`, 'important');
  root.style.setProperty('--app-base-font-size', `${calculatedPx}px`, 'important');
  root.style.setProperty('--app-font-scale', `${clampedSize}%`, 'important');
  root.style.setProperty('--app-font-ratio', `${clampedSize / 100}`, 'important');
  root.setAttribute('data-text-size', `${clampedSize}`);

  if (document.body) {
    document.body.style.setProperty('font-size', `${calculatedPx}px`, 'important');
    document.body.setAttribute('data-text-size', `${clampedSize}`);
  }

  try {
    window.dispatchEvent(
      new CustomEvent('medikiosk-text-size-change', {
        detail: { textSize: clampedSize, calculatedPx },
      })
    );
  } catch (e) {}
}

function applyDensityDom(density: DensityMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-density', density);
  if (document.body) {
    document.body.setAttribute('data-density', density);
  }
}

export const useAppearanceStore = create<AppearanceState>((set, get) => ({
  theme: 'light',
  density: 'comfortable',
  sidebarMode: 'expanded',
  resolvedTheme: 'light',
  textSize: 100,

  setTheme: (theme: ThemeMode) => {
    const resolved = applyThemeDom(theme);
    set({ theme, resolvedTheme: resolved });

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, theme }));
      } catch (e) {
        console.error('Failed to save theme preference', e);
      }
    }
  },

  setDensity: (density: DensityMode) => {
    applyDensityDom(density);
    set({ density });

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, density }));
      } catch (e) {
        console.error('Failed to save density preference', e);
      }
    }
  },

  setSidebarMode: (sidebarMode: SidebarMode) => {
    set({ sidebarMode });

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, sidebarMode }));
      } catch (e) {
        console.error('Failed to save sidebar preference', e);
      }
    }
  },

  toggleSidebarMode: () => {
    const nextMode = get().sidebarMode === 'expanded' ? 'collapsed' : 'expanded';
    get().setSidebarMode(nextMode);
  },

  setTextSize: (textSize: number) => {
    const clamped = Math.max(70, Math.min(160, Math.round(textSize)));
    applyTextSizeDom(clamped);
    set({ textSize: clamped });

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, textSize: clamped }));
      } catch (e) {
        console.error('Failed to save textSize preference', e);
      }
    }
  },

  increaseTextSize: (step = 5) => {
    const current = get().textSize || 100;
    get().setTextSize(current + step);
  },

  decreaseTextSize: (step = 5) => {
    const current = get().textSize || 100;
    get().setTextSize(current - step);
  },

  resetTextSize: () => {
    get().setTextSize(100);
  },

  initAppearance: () => {
    if (typeof window === 'undefined') return;

    try {
      const storedRaw = localStorage.getItem(STORAGE_KEY);
      const stored = storedRaw ? JSON.parse(storedRaw) : {};

      const initialTheme: ThemeMode = stored.theme || 'light';
      const initialDensity: DensityMode = stored.density || 'comfortable';
      const initialSidebar: SidebarMode = stored.sidebarMode || 'expanded';
      const initialTextSize: number = typeof stored.textSize === 'number' ? stored.textSize : 100;

      const resolved = applyThemeDom(initialTheme);
      applyDensityDom(initialDensity);
      applyTextSizeDom(initialTextSize);

      set({
        theme: initialTheme,
        density: initialDensity,
        sidebarMode: initialSidebar,
        resolvedTheme: resolved,
        textSize: initialTextSize,
      });

      // Listen for system theme changes if set to system
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        if (get().theme === 'system') {
          const newResolved = applyThemeDom('system');
          set({ resolvedTheme: newResolved });
        }
      };

      mediaQuery.addEventListener('change', handleSystemChange);
    } catch (e) {
      console.error('Failed to initialize appearance', e);
    }
  },
}));
