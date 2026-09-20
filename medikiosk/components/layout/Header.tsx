'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ShieldCheck, Tv, Minus, Plus } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { useAppearanceStore } from '@/store/appearanceStore';
import { toast } from 'sonner';

export function Header() {
  const toggleSidebar = usePatientStore((state) => state.toggleSidebar);
  const textSize = useAppearanceStore((state) => state.textSize);
  const increaseTextSize = useAppearanceStore((state) => state.increaseTextSize);
  const decreaseTextSize = useAppearanceStore((state) => state.decreaseTextSize);

  const [metrics, setMetrics] = React.useState({
    waiting: 0,
    inConsultation: 0,
    completed: 0,
    total: 0,
  });

  React.useEffect(() => {
    fetch('/api/queue')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.summary) {
          setMetrics(json.data.summary);
        }
      })
      .catch(() => {});
  }, []);

  const waitingCount = metrics.waiting;
  const inConsultationCount = metrics.inConsultation;
  const completedCount = metrics.completed;

  return (
    <header className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 pt-1 border-b border-[#E2E8F0]/70 dark:border-[#1E293B] mb-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Doctor Consultation Workstation
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 border border-[#DBEAFE] dark:border-[#334155]">
                <ShieldCheck className="h-3.5 w-3.5" />
                ABHA Verified Clinic
              </span>
            </div>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 hidden sm:block">
              Rapid Triage &bull; Structured Medical Summary &bull; Clinical Evidence &bull; Prescriptions
            </p>
          </div>
        </div>

        {/* Live OPD Metrics & Status Banner */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Waiting Badge -> Links to /waiting display */}
          <Link
            href="/waiting"
            title="Open Live Waiting Room Display"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-sm font-bold shadow-2xs transition-all cursor-pointer group"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Waiting:</span>
            <span className="font-extrabold">{waitingCount}</span>
            <Tv className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
          </Link>

          {/* In Consultation */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 text-sky-800 dark:text-sky-300 text-sm font-bold shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>In Consultation:</span>
            <span className="font-extrabold">{inConsultationCount}</span>
          </div>

          {/* Completed */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm font-bold shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Done:</span>
            <span className="font-extrabold">{completedCount}</span>
          </div>

          {/* Quick Global Text Size Stepper */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-[#E2E8F0] dark:border-[#334155] shadow-2xs" title="Adjust Global Text Size (Zoom)">
            <button
              type="button"
              onClick={() => {
                decreaseTextSize(5);
                toast.info(`Text size: ${Math.max(70, textSize - 5)}%`);
              }}
              disabled={textSize <= 70}
              className="h-6 w-6 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="Decrease text size (-5%)"
              aria-label="Decrease text size"
            >
              <Minus className="h-3 w-3 stroke-[3]" />
            </button>
            <span className="text-xs font-black text-[#1E3A8A] dark:text-sky-300 min-w-[40px] text-center select-none">
              {textSize}%
            </span>
            <button
              type="button"
              onClick={() => {
                increaseTextSize(5);
                toast.info(`Text size: ${Math.min(160, textSize + 5)}%`);
              }}
              disabled={textSize >= 160}
              className="h-6 w-6 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="Increase text size (+5%)"
              aria-label="Increase text size"
            >
              <Plus className="h-3 w-3 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
