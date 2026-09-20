'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAppearanceStore } from '@/store/appearanceStore';
import { useAuthStore } from '@/store/authStore';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const initAppearance = useAppearanceStore((state) => state.initAppearance);
  const initAuth = useAuthStore((state) => state.initAuth);
  const textSize = useAppearanceStore((state) => state.textSize);
  const setTextSize = useAppearanceStore((state) => state.setTextSize);
  const pathname = usePathname();

  // Initialize on mount
  React.useEffect(() => {
    initAppearance();
    initAuth();
  }, [initAppearance, initAuth]);

  // Ensure text size is strictly maintained on every route transition
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isWide = window.innerWidth >= 1440;
      const basePx = isWide ? 19 : 18;
      const calculatedPx = Math.round(((basePx * (textSize || 100)) / 100) * 100) / 100;

      document.documentElement.style.setProperty('font-size', `${calculatedPx}px`, 'important');
      document.documentElement.style.setProperty('--app-base-font-size', `${calculatedPx}px`, 'important');
      document.documentElement.style.setProperty('--app-font-scale', `${textSize || 100}%`, 'important');
      document.documentElement.setAttribute('data-text-size', `${textSize || 100}`);

      if (document.body) {
        document.body.style.setProperty('font-size', `${calculatedPx}px`, 'important');
        document.body.setAttribute('data-text-size', `${textSize || 100}`);
      }
    }
  }, [pathname, textSize]);

  // Sync window storage events across multiple tabs or windows
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'medikiosk_appearance_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (typeof parsed.textSize === 'number') {
            setTextSize(parsed.textSize);
          }
        } catch (err) { }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTextSize]);

  return <>{children}</>;
}
