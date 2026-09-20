'use client';

import * as React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
  Type,
} from 'lucide-react';
import { useAppearanceStore, ThemeMode } from '@/store/appearanceStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AppearanceSection() {
  const theme = useAppearanceStore((state) => state.theme);
  const resolvedTheme = useAppearanceStore((state) => state.resolvedTheme);
  const textSize = useAppearanceStore((state) => state.textSize);

  const setTheme = useAppearanceStore((state) => state.setTheme);
  const setTextSize = useAppearanceStore((state) => state.setTextSize);
  const increaseTextSize = useAppearanceStore((state) => state.increaseTextSize);
  const decreaseTextSize = useAppearanceStore((state) => state.decreaseTextSize);
  const resetTextSize = useAppearanceStore((state) => state.resetTextSize);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    const label =
      newTheme === 'system'
        ? 'System default'
        : `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode`;
    toast.success(`Theme updated to ${label}`);
  };

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Appearance &amp; Display</h3>
          <span className="text-[10px] font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-[#60A5FA] px-2 py-0.5 rounded-full border border-[#DBEAFE] dark:border-[#3B82F6]/30">
            Live Sync
          </span>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          Customize the color theme and global text size zoom. Changes apply immediately across all workstation pages, patient records, and waiting displays.
        </p>
      </div>

      {/* 1. Theme Selection */}
      <div>
        <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider mb-3">
          Color Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={cn(
              'group relative flex flex-col p-3.5 rounded-xl border text-left transition-all cursor-pointer',
              theme === 'light'
                ? 'border-[#1E3A8A] bg-[#EFF6FF]/80 ring-2 ring-[#1E3A8A]/20 shadow-xs dark:bg-slate-800/80 dark:border-[#3B82F6]'
                : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:border-[#1E3A8A]/50 hover:bg-slate-50/70'
            )}
          >
            {/* Visual Swatch */}
            <div className="w-full h-16 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex flex-col justify-between mb-3 overflow-hidden shadow-inner">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
                <div className="w-12 h-1.5 rounded bg-slate-300" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 rounded bg-white border border-[#E2E8F0]/80" />
                <div className="w-3/4 h-2 rounded bg-white border border-[#E2E8F0]/80" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className={cn('h-4 w-4', theme === 'light' ? 'text-[#1E3A8A] dark:text-[#60A5FA]' : 'text-[#64748B]')} />
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9]">Light</span>
              </div>
              {theme === 'light' && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-[#3B82F6] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">Crisp, clean clinical interface</p>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={cn(
              'group relative flex flex-col p-3.5 rounded-xl border text-left transition-all cursor-pointer',
              theme === 'dark'
                ? 'border-[#1E3A8A] bg-[#EFF6FF]/80 ring-2 ring-[#1E3A8A]/20 shadow-xs dark:bg-slate-800/80 dark:border-[#3B82F6]'
                : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:border-[#1E3A8A]/50 hover:bg-slate-50/70'
            )}
          >
            {/* Visual Swatch */}
            <div className="w-full h-16 rounded-lg bg-[#0B1120] border border-[#1E293B] p-2 flex flex-col justify-between mb-3 overflow-hidden shadow-inner">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <div className="w-12 h-1.5 rounded bg-[#1E293B]" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 rounded bg-[#0F172A] border border-[#1E293B]" />
                <div className="w-3/4 h-2 rounded bg-[#0F172A] border border-[#1E293B]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className={cn('h-4 w-4', theme === 'dark' ? 'text-[#1E3A8A] dark:text-[#60A5FA]' : 'text-[#64748B]')} />
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9]">Dark</span>
              </div>
              {theme === 'dark' && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-[#3B82F6] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">Deep midnight navy slate, reduces eye strain</p>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={cn(
              'group relative flex flex-col p-3.5 rounded-xl border text-left transition-all cursor-pointer',
              theme === 'system'
                ? 'border-[#1E3A8A] bg-[#EFF6FF]/80 ring-2 ring-[#1E3A8A]/20 shadow-xs dark:bg-slate-800/80 dark:border-[#3B82F6]'
                : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:border-[#1E3A8A]/50 hover:bg-slate-50/70'
            )}
          >
            {/* Visual Swatch (split) */}
            <div className="w-full h-16 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] flex mb-3 overflow-hidden shadow-inner">
              <div className="w-1/2 h-full bg-[#F8FAFC] p-2 flex flex-col justify-between border-r border-[#E2E8F0]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
                <div className="w-full h-2 rounded bg-white border border-[#E2E8F0]/80" />
              </div>
              <div className="w-1/2 h-full bg-[#0B1120] p-2 flex flex-col justify-between">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <div className="w-full h-2 rounded bg-[#0F172A] border border-[#1E293B]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className={cn('h-4 w-4', theme === 'system' ? 'text-[#1E3A8A] dark:text-[#60A5FA]' : 'text-[#64748B]')} />
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9]">System</span>
              </div>
              {theme === 'system' && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-[#3B82F6] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Follows your OS setting ({resolvedTheme} active)
            </p>
          </button>
        </div>
      </div>

      {/* 2. Text Size (Global Scaling) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
            Text Size (All Pages Zoom)
          </label>
          <span className="text-[11px] font-semibold text-[#1E3A8A] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#DBEAFE] dark:border-[#3B82F6]/30">
            Active: {textSize}% ({Math.round(((18 * textSize) / 100) * 10) / 10}px Base)
          </span>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#334155]">
                  <Type className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Global Text Size Scaling
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Dynamically enlarge or reduce all typography across patient records, forms, headers, and waiting room displays.
              </p>
            </div>

            {/* Stepper controls: - 100% + */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0B1120] p-1.5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  decreaseTextSize(5);
                  toast.info(`Text size: ${Math.max(70, textSize - 5)}%`);
                }}
                disabled={textSize <= 70}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F1F5F9] font-black hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Decrease text size (-5%)"
                aria-label="Decrease text size"
              >
                <Minus className="h-4 w-4 stroke-[3]" />
              </button>

              <div className="px-3.5 py-0.5 flex flex-col items-center min-w-[76px] select-none text-center">
                <span className="text-lg font-black text-[#1E3A8A] dark:text-[#60A5FA] tracking-tight leading-tight">
                  {textSize}%
                </span>
                <span className="text-[9px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  {textSize === 100 ? 'Default' : textSize > 100 ? 'Larger' : 'Smaller'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  increaseTextSize(5);
                  toast.info(`Text size: ${Math.min(160, textSize + 5)}%`);
                }}
                disabled={textSize >= 160}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F1F5F9] font-black hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Increase text size (+5%)"
                aria-label="Increase text size"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Quick Presets & Reset */}
          <div className="pt-3.5 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] mr-1">
                Presets:
              </span>
              {[85, 90, 100, 110, 120, 130, 140].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setTextSize(val);
                    toast.success(`Text size set to ${val}%`);
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border',
                    textSize === val
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs dark:bg-[#3B82F6] dark:border-[#3B82F6]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {val}%{val === 100 && ' (Default)'}
                </button>
              ))}
            </div>

            {textSize !== 100 && (
              <button
                type="button"
                onClick={() => {
                  resetTextSize();
                  toast.success('Text size reset to default (100%)');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#1E3A8A] dark:text-[#60A5FA] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] border border-transparent hover:border-[#DBEAFE] dark:hover:border-[#3B82F6]/30 transition-all cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to 100%</span>
              </button>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0B1120]/80 border border-[#E2E8F0]/70 dark:border-[#1E293B]">
            <p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] tracking-wider mb-1">
              Live Text Size Preview
            </p>
            <p className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
              Dr. Sharma &bull; Consultation Room 204 &bull; Token #104
            </p>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Acute intermittent tension headache with photo-sensitivity. Triage status verified with longitudinal EHR records.
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview / Status Box */}
      <div className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#0F172A]/70 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-[#1E3A8A] dark:text-[#60A5FA]" />
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9]">Active Configuration</h4>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Theme: <strong className="capitalize">{theme} ({resolvedTheme})</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Text Size: <strong>{textSize}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
