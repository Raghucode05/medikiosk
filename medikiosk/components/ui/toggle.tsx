'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({ checked, onChange, label, description, disabled = false, id }: ToggleProps) {
  const toggleId = id || React.useId();

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <label
              htmlFor={toggleId}
              className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{description}</p>
          )}
        </div>
      )}
      <button
        id={toggleId}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 cursor-pointer',
          checked
            ? 'bg-[#1E3A8A] border-[#1E3A8A]'
            : 'bg-[#E2E8F0] dark:bg-slate-700 border-[#CBD5E1] dark:border-slate-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          )}
        />
      </button>
    </div>
  );
}
