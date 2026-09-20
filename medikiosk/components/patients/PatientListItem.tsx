'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { ShieldCheck, AlertCircle, ArrowUpRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientListItemProps {
  patient: Patient;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PatientListItem({ patient, isSelected, onSelect }: PatientListItemProps) {
  const router = useRouter();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(patient.id);
  };

  const highSeverityAlert = patient.alerts?.find((a) => a.severity === 'high');

  return (
    <div
      onClick={() => onSelect(patient.id)}
      className={cn(
        'group relative flex items-center justify-between px-4 py-3.5 transition-all duration-150 cursor-pointer border-b border-[#E2E8F0]/50 dark:border-[#1E293B]/60',
        isSelected
          ? 'bg-[#EFF6FF]/90 dark:bg-[#1E293B] border-l-4 border-l-[#1E3A8A] shadow-xs'
          : 'bg-white dark:bg-[#0F172A] border-l-4 border-l-transparent hover:bg-slate-50/90 dark:hover:bg-slate-850'
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
        {/* Token Pill */}
        <div className="flex flex-col items-center justify-center w-12 shrink-0 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#1E293B] text-center">
          <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] leading-none">
            Token
          </span>
          <span className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC] leading-tight mt-0.5">
            #{patient.token}
          </span>
        </div>

        {/* Avatar */}
        <div className="relative shrink-0">
          <PatientAvatar
            id={patient.id}
            name={patient.name}
            gender={patient.gender}
            size="md"
            className="border border-slate-200 dark:border-slate-700 shadow-2xs"
          />
          {patient.abhaLinked && (
            <span
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs"
              title="ABHA Verified ID"
            >
              <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
            </span>
          )}
        </div>

        {/* Patient Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate leading-tight group-hover:text-[#1E3A8A] transition-colors">
              {patient.name}
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
              {patient.age}y &bull; {patient.gender}
            </span>
          </div>

          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] truncate leading-tight mt-1 flex items-center gap-2">
            <span className="font-semibold text-[#0F172A]/90 dark:text-slate-200">
              {patient.chiefComplaint}
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="inline-flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {patient.appointmentTime}
            </span>
          </p>

          {highSeverityAlert && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/60">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{highSeverityAlert.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/patients/${patient.id}`}
        onClick={handleView}
        className={cn(
          'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer shadow-2xs inline-flex items-center gap-1.5',
          isSelected
            ? 'bg-[#1E3A8A] text-white shadow-blue-900/30 shadow-md'
            : 'border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-white bg-white dark:bg-[#1E293B] hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
        )}
      >
        <span>Summary</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
