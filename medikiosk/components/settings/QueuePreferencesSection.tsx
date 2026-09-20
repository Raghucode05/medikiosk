'use client';

import * as React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';

const STORAGE_KEY = 'medikiosk_queue_preferences';

export function QueuePreferencesSection() {
  const [prefs, setPrefs] = React.useState({
    duration: '15',
    autoMove: true,
    showToken: true,
    playSound: false,
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPrefs({
            duration: json.data.duration || '15',
            autoMove: json.data.autoMove ?? true,
            showToken: json.data.showToken ?? true,
            playSound: json.data.playSound ?? false,
          });
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setPrefs(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      });
  }, []);

  const updatePref = async <K extends keyof typeof prefs>(key: K, value: typeof prefs[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      toast.success('Queue preference updated in SQLite');
    } catch (e) {
      console.error(e);
      toast.success('Queue preference updated');
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Queue Preferences</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Configure how the patient queue behaves</p>
      </div>

      {/* Duration selector */}
      <div>
        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
          Default consultation duration
        </label>
        <select
          value={prefs.duration}
          onChange={(e) => updatePref('duration', e.target.value)}
          className="w-full max-w-xs px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all cursor-pointer"
        >
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
        <Toggle
          checked={prefs.autoMove}
          onChange={(v) => updatePref('autoMove', v)}
          label="Automatically move next patient"
          description="Automatically call the next patient when a consultation ends"
        />
        <Toggle
          checked={prefs.showToken}
          onChange={(v) => updatePref('showToken', v)}
          label="Show token number"
          description="Display token numbers in the patient queue"
        />
        <Toggle
          checked={prefs.playSound}
          onChange={(v) => updatePref('playSound', v)}
          label="Play queue notification sound"
          description="Play a sound when the next patient is called"
        />
      </div>
    </div>
  );
}
