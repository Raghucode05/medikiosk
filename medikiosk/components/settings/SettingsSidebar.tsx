'use client';

import * as React from 'react';
import { User, Building2, Bell, ListOrdered, Palette, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsSection =
  | 'profile'
  | 'clinic'
  | 'notifications'
  | 'queue'
  | 'appearance'
  | 'security';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'clinic', label: 'Clinic Information', icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'queue', label: 'Queue Preferences', icon: ListOrdered },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'security', label: 'Security', icon: Shield },
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <nav
      className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[#E2E8F0] dark:border-[#1E293B] p-2 md:py-3 md:px-2.5 overflow-x-auto md:overflow-x-visible no-scrollbar"
      role="tablist"
      aria-label="Settings navigation"
    >
      <div className="flex md:flex-col gap-1.5 min-w-max md:min-w-0">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;
          return (
            <button
              key={section.key}
              id={`settings-tab-${section.key}`}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSectionChange(section.key)}
              className={cn(
                'group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 md:w-full text-left border',
                isActive
                  ? 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-[#60A5FA] border-[#1E3A8A]/30 dark:border-[#3B82F6]/40 font-semibold shadow-xs'
                  : 'bg-transparent border-transparent text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 hover:text-[#0F172A] dark:hover:text-[#F1F5F9]'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                    isActive ? 'text-[#1E3A8A] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'
                  )}
                />
                <span className="truncate">{section.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 shrink-0 hidden md:block transition-opacity',
                  isActive ? 'text-[#1E3A8A] dark:text-[#60A5FA] opacity-100' : 'opacity-0 text-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
