'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { QueueStatus } from '@/types/queue';

interface StatusBadgeProps {
  status: QueueStatus;
  className?: string;
}

const statusConfig: Record<
  QueueStatus,
  { label: string; classes: string; dotClass: string; ping?: boolean }
> = {
  waiting: {
    label: 'Waiting',
    classes:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    dotClass: 'bg-amber-500',
    ping: true,
  },
  'in-consultation': {
    label: 'In Consultation',
    classes:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/50',
    dotClass: 'bg-sky-500',
    ping: true,
  },
  completed: {
    label: 'Completed',
    classes:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    dotClass: 'bg-emerald-500',
    ping: false,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs',
        config.classes,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {config.ping && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.dotClass
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dotClass)} />
      </span>
      <span>{config.label}</span>
    </span>
  );
}
