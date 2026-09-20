'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  key: string;
  label: string;
}

interface SearchFiltersProps {
  searchByOptions: FilterOption[];
  activeSearchBy: string;
  onSearchByChange: (key: string) => void;
  statusOptions: FilterOption[];
  activeStatus: string;
  onStatusChange: (key: string) => void;
  dateOptions: FilterOption[];
  activeDate: string;
  onDateChange: (key: string) => void;
}

function FilterGroup({
  label,
  options,
  activeKey,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
              activeKey === opt.key
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] hover:text-[#0F172A]'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SearchFilters({
  searchByOptions,
  activeSearchBy,
  onSearchByChange,
  statusOptions,
  activeStatus,
  onStatusChange,
  dateOptions,
  activeDate,
  onDateChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-start gap-6 py-3 px-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-[#E2E8F0]/50 dark:border-[#1E293B]/50">
      <FilterGroup
        label="Search By"
        options={searchByOptions}
        activeKey={activeSearchBy}
        onChange={onSearchByChange}
      />
      <FilterGroup
        label="Status"
        options={statusOptions}
        activeKey={activeStatus}
        onChange={onStatusChange}
      />
      <FilterGroup
        label="Date"
        options={dateOptions}
        activeKey={activeDate}
        onChange={onDateChange}
      />
    </div>
  );
}
