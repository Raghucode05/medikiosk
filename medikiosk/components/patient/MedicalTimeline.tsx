'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  FlaskConical,
  Pill,
  FileText,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function MedicalTimeline() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const { patients, getSelectedPatient, timelineTab, setTimelineTab } = usePatientStore();
  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();

  if (!patient) return null;

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'lab-report':
        return {
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          icon: <FlaskConical className="h-3.5 w-3.5" />,
        };
      case 'prescription':
        return {
          bg: 'bg-rose-50 text-rose-500 border-rose-200',
          icon: <Pill className="h-3.5 w-3.5" />,
        };
      case 'discharge':
        return {
          bg: 'bg-sky-50 text-sky-600 border-sky-200',
          icon: <FileText className="h-3.5 w-3.5" />,
        };
      case 'surgery':
        return {
          bg: 'bg-teal-50 text-teal-600 border-teal-200',
          icon: <Activity className="h-3.5 w-3.5" />,
        };
      default:
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-200',
          icon: <Activity className="h-3.5 w-3.5" />,
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs overflow-hidden">
      <div className="p-3.5 border-b border-[#E2E8F0]/70 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Link
            href={`/patients/${patient.id}`}
            aria-label="Back to patient summary"
            className="cursor-pointer hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#0F172A] dark:text-[#F8FAFC] stroke-[2.5]" />
          </Link>
          <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Timeline</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTimelineTab('medical-timeline')}
            className={cn(
              'px-3.5 py-1 rounded-full text-sm font-semibold transition-all cursor-pointer',
              timelineTab === 'medical-timeline'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B]'
            )}
          >
            Medical Timeline
          </button>
          <button
            onClick={() => setTimelineTab('documents')}
            className={cn(
              'px-3.5 py-1 rounded-full text-sm font-semibold transition-all cursor-pointer',
              timelineTab === 'documents'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B]'
            )}
          >
            Documents
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1E3A8A]/30">
          {patient.timeline.map((event) => {
            const badge = getEventBadge(event.type);
            return (
              <div
                key={event.id}
                onClick={() => toast.info(`Viewing ${event.title}`)}
                className="group relative flex items-start justify-between gap-2 p-1.5 rounded-xl hover:bg-[#EFF6FF]/60 dark:hover:bg-[#1E293B]/60 transition-colors cursor-pointer"
              >
                <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-[#0F172A] ring-4 ring-white dark:ring-[#0F172A] shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-[#1E3A8A]" />
                </div>

                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-2xs',
                      badge.bg
                    )}
                  >
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate leading-tight group-hover:text-[#1E3A8A] transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-tight">{event.date}</p>
                    <p className="text-sm text-[#0F172A]/80 dark:text-slate-300 font-medium mt-0.5 truncate leading-tight">
                      {event.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-[#64748B] shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
