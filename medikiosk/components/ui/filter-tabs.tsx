'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FilterTab {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function FilterTabs({ tabs, activeTab, onTabChange, className }: FilterTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto no-scrollbar border border-[#E2E8F0]/60 dark:border-[#1E293B]/60',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
              isActive
                ? 'bg-white dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                  isActive
                    ? 'bg-[#EFF6FF] dark:bg-slate-800 text-[#1E3A8A]'
                    : 'bg-slate-200 dark:bg-slate-700 text-[#64748B] dark:text-[#94A3B8]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
