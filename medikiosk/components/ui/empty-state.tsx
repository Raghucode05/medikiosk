'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{title}</h3>
      {description && (
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-xs">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
