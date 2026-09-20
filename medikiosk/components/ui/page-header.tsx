'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const toggleSidebar = usePatientStore((state) => state.toggleSidebar);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E2E8F0]/80 dark:border-[#1E293B]">
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 ml-0 md:ml-0">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
