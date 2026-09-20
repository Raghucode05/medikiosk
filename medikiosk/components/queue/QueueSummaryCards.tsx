'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Stethoscope, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { QueueSummary } from '@/types/queue';

interface QueueSummaryCardsProps {
  summary: QueueSummary;
}

const cards = [
  {
    key: 'waiting' as const,
    label: 'Waiting',
    subtext: 'In queue for OPD',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200/80 dark:border-amber-800/40',
  },
  {
    key: 'inConsultation' as const,
    label: 'In Consultation',
    subtext: 'Currently with doctor',
    icon: Stethoscope,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-200/80 dark:border-sky-800/40',
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    subtext: 'Consultation finished',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200/80 dark:border-emerald-800/40',
  },
  {
    key: 'total' as const,
    label: 'Total Booked',
    subtext: "Today's total registrations",
    icon: Users,
    color: 'text-[#1E3A8A] dark:text-sky-300',
    bg: 'bg-[#EFF6FF] dark:bg-[#1E293B]',
    borderColor: 'border-[#DBEAFE] dark:border-[#334155]',
  },
];

export function QueueSummaryCards({ summary }: QueueSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={cn(
              'group relative flex items-center gap-3.5 p-4 rounded-2xl border bg-white dark:bg-[#0F172A] transition-all duration-200 hover:-translate-y-0.5 card-subtle',
              card.borderColor
            )}
          >
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                card.bg
              )}
            >
              <Icon className={cn('h-5 w-5', card.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-none">
                  {summary[card.key]}
                </p>
              </div>
              <p className="text-xs font-bold text-[#0F172A]/90 dark:text-slate-300 leading-tight mt-1 truncate">
                {card.label}
              </p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight truncate mt-0.5">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
