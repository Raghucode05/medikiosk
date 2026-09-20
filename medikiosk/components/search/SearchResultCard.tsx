'use client';

import * as React from 'react';
import Link from 'next/link';
import { QueuePatient } from '@/types/queue';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { ShieldCheck, ArrowUpRight, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultCardProps {
  patient: QueuePatient;
}

export function SearchResultCard({ patient }: SearchResultCardProps) {
  return (
    <div className="group flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors border-b border-[#E2E8F0]/80 dark:border-[#1E293B]">
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
        {/* Token chip */}
        <div className="flex flex-col items-center justify-center w-11 shrink-0 py-1 px-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#1E293B] text-center">
          <span className="text-[9px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] leading-none">
            Token
          </span>
          <span className="text-sm font-extrabold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
            #{patient.token}
          </span>
        </div>

        <PatientAvatar
          id={patient.id}
          name={patient.name}
          gender={patient.gender}
          size="md"
          className="border border-slate-200 dark:border-slate-700 shadow-2xs"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] truncate leading-tight group-hover:text-[#1E3A8A] dark:group-hover:text-[#60A5FA] transition-colors">
              {patient.name}
            </h4>
            <StatusBadge status={patient.status} className="hidden sm:inline-flex" />
            {patient.abhaId && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                <ShieldCheck className="h-2.5 w-2.5" />
                ABHA Linked
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
            {patient.abhaId && (
              <span className="font-medium text-slate-700 dark:text-slate-300">
                ID: {patient.abhaId}
              </span>
            )}
            {patient.phone && (
              <span className="hidden md:inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                {patient.phone}
              </span>
            )}
            {patient.lastVisit && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                Last Visit: {patient.lastVisit}
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/patients/${patient.id}`}
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs inline-flex items-center gap-1 border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] bg-white dark:bg-[#1E293B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] dark:hover:border-[#3B82F6] dark:hover:text-[#60A5FA]"
      >
        <span>View</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
