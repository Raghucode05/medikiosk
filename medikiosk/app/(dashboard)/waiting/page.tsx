'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowLeft,
  Sparkles,
  Users,
  CheckCircle2,
  Building2,
  Bell,
  Stethoscope,
  Activity,
  Calendar,
  Minus,
  Plus,
} from 'lucide-react';
import { QueuePatient, QueueSummary } from '@/types/queue';
import { useAppearanceStore } from '@/store/appearanceStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function WaitingRoomPage() {
  const textSize = useAppearanceStore((state) => state.textSize);
  const increaseTextSize = useAppearanceStore((state) => state.increaseTextSize);
  const decreaseTextSize = useAppearanceStore((state) => state.decreaseTextSize);
  const [patients, setPatients] = React.useState<QueuePatient[]>([]);
  const [summary, setSummary] = React.useState<QueueSummary>({
    waiting: 0,
    inConsultation: 0,
    completed: 0,
    total: 0,
  });
  const [clinicName, setClinicName] = React.useState('MediKiosk OPD Clinic');
  const [currentTime, setCurrentTime] = React.useState('');
  const [currentDate, setCurrentDate] = React.useState('');
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [lastCalledToken, setLastCalledToken] = React.useState<string | null>(null);
  const [callingFlash, setCallingFlash] = React.useState(false);

  // Scroll Container & Auto-Scroll
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(false);

  // Hands-free TV / Kiosk Display Auto-Scroll loop
  React.useEffect(() => {
    if (!autoScroll) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let dir: 'down' | 'up' = 'down';
    let pauseUntil = 0;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      if (Date.now() < pauseUntil) return;

      const el = scrollContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 10) return;

      if (dir === 'down') {
        if (scrollTop + clientHeight >= scrollHeight - 8) {
          dir = 'up';
          pauseUntil = Date.now() + 3000;
        } else {
          el.scrollTop += 2;
        }
      } else {
        if (scrollTop <= 8) {
          dir = 'down';
          pauseUntil = Date.now() + 2500;
        } else {
          el.scrollTop -= 3;
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [autoScroll]);

  // Live Clock
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch queue from SQLite API
  const fetchQueueData = React.useCallback(async () => {
    try {
      const res = await fetch('/api/queue');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const list: QueuePatient[] = json.data.patients || [];
          setPatients(list);
          if (json.data.summary) {
            setSummary(json.data.summary);
          }

          // Check currently in consultation token
          const inConsult = list.find((p) => p.status === 'in-consultation');
          if (inConsult && inConsult.token !== lastCalledToken) {
            setLastCalledToken(inConsult.token);
            setCallingFlash(true);
            setTimeout(() => setCallingFlash(false), 2000);
            if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
              playChime();
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to poll queue for waiting room:', e);
    }
  }, [lastCalledToken, soundEnabled]);

  // Initial load + periodic poll every 4s
  React.useEffect(() => {
    fetchQueueData();
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.name) {
          setClinicName(d.data.name);
        }
      })
      .catch(() => {});

    const interval = setInterval(fetchQueueData, 4000);
    return () => clearInterval(interval);
  }, [fetchQueueData]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      // Audio context may be restricted before user gesture
    }
  };

  // Call patient to consultation
  const handleCallPatient = async (patient: QueuePatient) => {
    try {
      const res = await fetch(`/api/queue/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in-consultation' }),
      });
      if (res.ok) {
        toast.success(`Calling Token #${patient.token} (${patient.name})`, {
          description: 'Patient status updated to In Consultation.',
        });
        playChime();
        fetchQueueData();
      }
    } catch (e) {
      toast.error('Failed to call patient');
    }
  };

  // Complete consultation
  const handleCompletePatient = async (patient: QueuePatient) => {
    try {
      const res = await fetch(`/api/queue/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (res.ok) {
        toast.success(`Completed Token #${patient.token} (${patient.name})`, {
          description: 'Consultation marked as completed in SQLite.',
        });
        fetchQueueData();
      }
    } catch (e) {
      toast.error('Failed to mark consultation completed');
    }
  };

  const inConsultationPatient = patients.find((p) => p.status === 'in-consultation');
  const waitingPatients = patients.filter((p) => p.status === 'waiting');
  const completedPatients = patients.filter((p) => p.status === 'completed');

  return (
    <div
      ref={scrollContainerRef}
      tabIndex={0}
      className="h-full w-full overflow-y-auto overflow-x-hidden waiting-room-scroll flex flex-col bg-[#F8FAFC] dark:bg-[#070F1E] text-[#0F172A] dark:text-slate-100 selection:bg-[#1E3A8A] selection:text-white font-sans transition-colors duration-200 scroll-smooth relative focus:outline-none"
    >
      {/* Top TV Header Bar (Sticky) */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b border-[#E2E8F0] dark:border-white/10 bg-white/95 dark:bg-[#0B1528]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-white/10 hover:bg-[#DBEAFE] dark:hover:bg-white/20 text-[#1E3A8A] dark:text-slate-200 transition-colors cursor-pointer"
            title="Return to Doctor Workstation"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] dark:bg-white/10 hover:bg-[#DBEAFE] dark:hover:bg-white/20 text-xs font-bold text-[#1E3A8A] dark:text-slate-300 transition-colors cursor-pointer hidden md:inline-flex items-center gap-1.5"
            title="Open Doctor Workstation"
          >
            <Users className="h-3.5 w-3.5 text-[#1E3A8A] dark:text-[#60A5FA]" />
            <span>Manage Queue</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white shadow-md shadow-blue-900/30">
              <Stethoscope className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                <span>{clinicName}</span>
                <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  Live OPD Display
                </span>
              </h1>
              <p className="text-sm text-[#64748B] dark:text-slate-400 mt-0.5">
                Consultation Room 204 &bull; Dr. Sharma &bull; Attending General OPD
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end pr-3 border-r border-[#E2E8F0] dark:border-white/10 text-right">
            <div className="text-xl sm:text-2xl font-mono font-black text-[#1E3A8A] dark:text-[#60A5FA] tracking-wider">
              {currentTime || '--:--:-- --'}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-slate-400">
              {currentDate || 'Today'}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Text Size Stepper */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EFF6FF] dark:bg-white/10 border border-[#DBEAFE] dark:border-white/15 shadow-2xs" title="Adjust Display Text Size (Zoom)">
              <button
                type="button"
                onClick={() => {
                  decreaseTextSize(5);
                  toast.info(`Text size: ${Math.max(70, textSize - 5)}%`);
                }}
                disabled={textSize <= 70}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
                title="Decrease text size (-5%)"
                aria-label="Decrease text size"
              >
                <Minus className="h-3.5 w-3.5 stroke-[3]" />
              </button>
              <span className="text-xs font-black text-[#1E3A8A] dark:text-[#60A5FA] min-w-[42px] text-center select-none">
                {textSize}%
              </span>
              <button
                type="button"
                onClick={() => {
                  increaseTextSize(5);
                  toast.info(`Text size: ${Math.min(160, textSize + 5)}%`);
                }}
                disabled={textSize >= 160}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
                title="Increase text size (+5%)"
                aria-label="Increase text size"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Waiting Room Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full pb-24">
        {/* NOW CALLING / CURRENT CONSULTATION HERO SECTION */}
        <section className={cn(
          'relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 sm:p-8',
          callingFlash
            ? 'border-amber-400 bg-amber-100 dark:bg-amber-500/15 shadow-2xl shadow-amber-500/20'
            : inConsultationPatient
            ? 'border-[#1E3A8A]/30 dark:border-[#1E3A8A]/50 bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] dark:from-[#0A192F] dark:via-[#0F294D] dark:to-[#0A192F] shadow-2xl shadow-blue-200/60 dark:shadow-blue-950/60'
            : 'border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0A162B]'
        )}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex-1 min-w-[280px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/30 text-[#1E3A8A] dark:text-[#93C5FD] border border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 text-sm font-extrabold uppercase tracking-widest mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1E3A8A] dark:bg-[#60A5FA] animate-ping" />
                <span>Now In Consultation &bull; Room 204</span>
              </div>

              {inConsultationPatient ? (
                <div>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3.5">
                    <span>{inConsultationPatient.name}</span>
                    <span className="text-sm sm:text-base font-bold text-[#64748B] dark:text-slate-300 px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-white/10 border border-[#E2E8F0] dark:border-white/10">
                      {inConsultationPatient.type}
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-300 mt-2.5 flex items-center gap-3">
                    <span>Consulting with: <strong className="text-[#0F172A] dark:text-white">Dr. Sharma</strong></span>
                    <span>&bull;</span>
                    <span>Gender: <strong>{inConsultationPatient.gender}</strong></span>
                    <span>&bull;</span>
                    <span>Time: <strong>{inConsultationPatient.time}</strong></span>
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCompletePatient(inConsultationPatient)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete Consultation</span>
                    </button>
                    {waitingPatients.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleCallPatient(waitingPatients[0])}
                        className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Bell className="h-4 w-4" />
                        <span>Call Next: #{waitingPatients[0].token} ({waitingPatients[0].name})</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black text-[#64748B] dark:text-slate-300">
                    Consultation Room Ready
                  </h2>
                  <p className="text-sm sm:text-base text-[#94A3B8] dark:text-slate-400 mt-1.5">
                    {waitingPatients.length > 0
                      ? `${waitingPatients.length} patient(s) waiting in queue. Click below to call the next patient.`
                      : 'No patients waiting. Take a break or await new triage registrations.'}
                  </p>
                  {waitingPatients.length > 0 && (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => handleCallPatient(waitingPatients[0])}
                        className="px-6 py-3 rounded-2xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-base font-black transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Bell className="h-4.5 w-4.5" />
                        <span>Call Next Patient: #{waitingPatients[0].token} ({waitingPatients[0].name})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Giant Token Call Badge */}
            <div className="flex flex-col items-center justify-center min-w-[200px] sm:min-w-[260px] py-5 px-7 rounded-3xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white shadow-xl shadow-blue-900/40 border border-[#3B82F6]/30 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-100">
                Calling Token
              </span>
              <span className="text-5xl sm:text-7xl font-black tracking-tight leading-none my-1.5">
                #{inConsultationPatient ? inConsultationPatient.token : waitingPatients[0]?.token || '--'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-blue-100 mt-0.5">
                Room 204 &bull; Pod 2
              </span>
            </div>
          </div>
        </section>

        {/* Live Counters Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4.5 rounded-2xl bg-white dark:bg-[#0C182E] border border-[#E2E8F0] dark:border-white/10 flex items-center gap-3.5 transition-colors duration-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400">Waiting in Lobby</p>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">{summary.waiting}</p>
            </div>
          </div>

          <div className="p-4.5 rounded-2xl bg-white dark:bg-[#0C182E] border border-[#E2E8F0] dark:border-white/10 flex items-center gap-3.5 transition-colors duration-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-500/20 text-[#1E3A8A] dark:text-[#60A5FA]">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400">In Consultation</p>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">{summary.inConsultation}</p>
            </div>
          </div>

          <div className="p-4.5 rounded-2xl bg-white dark:bg-[#0C182E] border border-[#E2E8F0] dark:border-white/10 flex items-center gap-3.5 transition-colors duration-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400">Completed Today</p>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">{summary.completed}</p>
            </div>
          </div>

          <div className="p-4.5 rounded-2xl bg-white dark:bg-[#0C182E] border border-[#E2E8F0] dark:border-white/10 flex items-center gap-3.5 transition-colors duration-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-[#1E3A8A]/30 text-[#1E3A8A] dark:text-[#60A5FA]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400">Total OPD Registered</p>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">{summary.total}</p>
            </div>
          </div>
        </div>

        {/* Lower Grid: Waiting List (Left) and Completed Consultations (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Waiting Queue Cards (2 Columns on Large Screens) */}
          <div className="lg:col-span-2 flex flex-col rounded-3xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0A152A] p-5.5 shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0] dark:border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-lg text-[#0F172A] dark:text-white tracking-tight">
                  Upcoming Waiting Queue
                </h3>
                <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                  {waitingPatients.length} in queue
                </span>
              </div>
              <span className="text-sm text-[#64748B] dark:text-slate-400">
                Sorted by arrival &amp; priority
              </span>
            </div>

            <div className="flex-1 space-y-3 pr-1">
              {waitingPatients.length > 0 ? (
                waitingPatients.map((patient, index) => (
                  <div
                    key={`waiting-${patient.id}-${patient.token}-${index}`}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-2xl border transition-all',
                      index === 0
                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 shadow-md shadow-amber-200/20 dark:shadow-amber-950/20'
                        : 'bg-[#F8FAFC] dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 hover:border-[#1E3A8A]/30 dark:hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn(
                        'flex flex-col items-center justify-center w-14 h-14 rounded-xl font-black text-center shrink-0 border',
                        index === 0
                          ? 'bg-amber-500 text-slate-900 border-amber-400'
                          : 'bg-[#EFF6FF] dark:bg-white/10 text-[#1E3A8A] dark:text-white border-[#DBEAFE] dark:border-white/10'
                      )}>
                        <span className="text-[10px] uppercase tracking-wider font-bold">Token</span>
                        <span className="text-lg font-black leading-none">#{patient.token}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <p className="text-base font-bold text-[#0F172A] dark:text-white truncate">
                            {patient.name}
                          </p>
                          {index === 0 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30 uppercase">
                              Next in Line
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                          {patient.type} &bull; {patient.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-[#64748B] dark:text-slate-400 mr-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{patient.time}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCallPatient(patient)}
                        className="px-3.5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title={`Call #${patient.token} to consultation`}
                      >
                        <Bell className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#64748B] dark:text-slate-400">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 dark:text-emerald-400 mb-2" />
                  <p className="font-bold text-base text-[#0F172A] dark:text-white">Queue is clear</p>
                  <p className="text-sm mt-0.5">All waiting patients have been attended.</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Consultations List */}
          <div className="flex flex-col rounded-3xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0A152A] p-5.5 shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0] dark:border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-lg text-[#0F172A] dark:text-white tracking-tight">
                  Completed
                </h3>
                <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  {completedPatients.length}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 pr-1">
              {completedPatients.length > 0 ? (
                completedPatients.map((patient, index) => (
                  <div
                    key={`completed-${patient.id}-${patient.token}-${index}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/5 hover:border-[#1E3A8A]/20 dark:hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm shrink-0 border border-emerald-200 dark:border-emerald-500/30">
                        #{patient.token}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 truncate">
                          {patient.type}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Done</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#64748B] dark:text-slate-400">
                  <p className="text-sm">No completed consultations yet today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info Ribbon */}
      <footer className="px-6 py-3 border-t border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#070F1E] text-center text-sm text-[#64748B] dark:text-slate-500 flex flex-wrap items-center justify-between gap-2 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>Real-Time OPD Telemetry Active &bull; Connected to SQLite Database</span>
        </div>
        <div>
          <span>Ayushman Bharat Digital Mission (ABDM) &bull; MediKiosk Consultation Suite</span>
        </div>
      </footer>
    </div>
  );
}
