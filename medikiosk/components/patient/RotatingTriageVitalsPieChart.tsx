'use client';

import * as React from 'react';
import {
  Activity,
  Heart,
  Wind,
  Thermometer,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VitalData {
  id: 'bp' | 'pulse' | 'spo2' | 'temp';
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'optimal' | 'elevated' | 'high';
  statusText: string;
  color: string;
  accentColor: string;
  lightBg: string;
  darkBg: string;
  glowColor: string;
  gradient: [string, string];
  icon: React.ElementType;
  description: string;
}

interface RotatingTriageVitalsPieChartProps {
  patientId?: string;
  patientName?: string;
}

// Patient-tailored vitals based on triage records
export function getPatientVitals(patientId?: string): VitalData[] {
  switch (patientId) {
    case 'P001': // Ramesh Kumar - Fever with cough
      return [
        {
          id: 'bp',
          label: 'Blood Pressure',
          value: '120/80',
          unit: 'mmHg',
          status: 'normal',
          statusText: 'Normal (120/80)',
          color: '#1E3A8A',
          accentColor: '#3B82F6',
          lightBg: 'bg-blue-50 border-blue-200 text-blue-900',
          darkBg: 'dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-300',
          glowColor: 'rgba(59, 130, 246, 0.4)',
          gradient: ['#1E3A8A', '#3B82F6'],
          icon: Activity,
          description: 'Systolic 120 / Diastolic 80 within optimal range',
        },
        {
          id: 'pulse',
          label: 'Pulse Rate',
          value: '84',
          unit: 'bpm',
          status: 'normal',
          statusText: 'Normal sinus rhythm',
          color: '#E11D48',
          accentColor: '#FB7185',
          lightBg: 'bg-rose-50 border-rose-200 text-rose-800',
          darkBg: 'dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300',
          glowColor: 'rgba(244, 63, 94, 0.4)',
          gradient: ['#E11D48', '#FB7185'],
          icon: Heart,
          description: 'Regular resting cardiac rhythm',
        },
        {
          id: 'spo2',
          label: 'Oxygen (SpO2)',
          value: '97',
          unit: '%',
          status: 'optimal',
          statusText: 'Adequate saturation',
          color: '#059669',
          accentColor: '#34D399',
          lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          darkBg: 'dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          gradient: ['#059669', '#34D399'],
          icon: Wind,
          description: 'Arterial blood oxygen well-saturated',
        },
        {
          id: 'temp',
          label: 'Temperature',
          value: '101.2',
          unit: '°F',
          status: 'elevated',
          statusText: 'Febrile (Low-grade fever)',
          color: '#D97706',
          accentColor: '#FBBF24',
          lightBg: 'bg-amber-50 border-amber-200 text-amber-800',
          darkBg: 'dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          gradient: ['#D97706', '#FBBF24'],
          icon: Thermometer,
          description: 'Elevated temperature consistent with acute respiratory infection',
        },
      ];

    case 'P002': // Savita Devi - Hypertension & Migraine
      return [
        {
          id: 'bp',
          label: 'Blood Pressure',
          value: '150/95',
          unit: 'mmHg',
          status: 'high',
          statusText: 'Stage 2 Hypertension',
          color: '#E11D48',
          accentColor: '#FB7185',
          lightBg: 'bg-rose-50 border-rose-200 text-rose-800',
          darkBg: 'dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300',
          glowColor: 'rgba(225, 29, 72, 0.4)',
          gradient: ['#BE123C', '#F43F5E'],
          icon: Activity,
          description: 'Elevated arterial pressure contributing to throbbing cephalalgia',
        },
        {
          id: 'pulse',
          label: 'Pulse Rate',
          value: '76',
          unit: 'bpm',
          status: 'normal',
          statusText: 'Normal resting rhythm',
          color: '#1E3A8A',
          accentColor: '#3B82F6',
          lightBg: 'bg-blue-50 border-blue-200 text-blue-800',
          darkBg: 'dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-300',
          glowColor: 'rgba(59, 130, 246, 0.4)',
          gradient: ['#1E3A8A', '#3B82F6'],
          icon: Heart,
          description: 'Steady pulse rate with synchronous peripheral perfusion',
        },
        {
          id: 'spo2',
          label: 'Oxygen (SpO2)',
          value: '98',
          unit: '%',
          status: 'optimal',
          statusText: 'Optimal blood oxygen',
          color: '#059669',
          accentColor: '#34D399',
          lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          darkBg: 'dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          gradient: ['#059669', '#34D399'],
          icon: Wind,
          description: 'Arterial blood oxygen well-saturated',
        },
        {
          id: 'temp',
          label: 'Temperature',
          value: '98.6',
          unit: '°F',
          status: 'normal',
          statusText: 'Normothermic',
          color: '#D97706',
          accentColor: '#FBBF24',
          lightBg: 'bg-amber-50 border-amber-200 text-amber-800',
          darkBg: 'dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          gradient: ['#D97706', '#FBBF24'],
          icon: Thermometer,
          description: 'Core body temperature normal',
        },
      ];

    default: // Standard MediKiosk Pod 2 recorded vitals
      return [
        {
          id: 'bp',
          label: 'Blood Pressure',
          value: '120/80',
          unit: 'mmHg',
          status: 'normal',
          statusText: 'Normal (120/80)',
          color: '#1E3A8A',
          accentColor: '#3B82F6',
          lightBg: 'bg-blue-50 border-blue-200 text-blue-900',
          darkBg: 'dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-300',
          glowColor: 'rgba(59, 130, 246, 0.4)',
          gradient: ['#1E3A8A', '#3B82F6'],
          icon: Activity,
          description: 'Optimal systolic and diastolic hemodynamic pressure',
        },
        {
          id: 'pulse',
          label: 'Pulse Rate',
          value: '74',
          unit: 'bpm',
          status: 'normal',
          statusText: 'Resting pulse',
          color: '#E11D48',
          accentColor: '#FB7185',
          lightBg: 'bg-rose-50 border-rose-200 text-rose-800',
          darkBg: 'dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300',
          glowColor: 'rgba(244, 63, 94, 0.4)',
          gradient: ['#E11D48', '#FB7185'],
          icon: Heart,
          description: 'Normal resting heart rate (60-100 bpm range)',
        },
        {
          id: 'spo2',
          label: 'Oxygen (SpO2)',
          value: '98',
          unit: '%',
          status: 'optimal',
          statusText: 'Optimal (98%)',
          color: '#059669',
          accentColor: '#34D399',
          lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          darkBg: 'dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          gradient: ['#059669', '#34D399'],
          icon: Wind,
          description: 'Optimal pulse oximetry reading without oxygen support',
        },
        {
          id: 'temp',
          label: 'Temperature',
          value: '98.6',
          unit: '°F',
          status: 'normal',
          statusText: 'Normothermic (98.6°F)',
          color: '#D97706',
          accentColor: '#FBBF24',
          lightBg: 'bg-amber-50 border-amber-200 text-amber-800',
          darkBg: 'dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          gradient: ['#D97706', '#FBBF24'],
          icon: Thermometer,
          description: 'Normal body temperature recorded via non-contact sensor',
        },
      ];
  }
}

// Generate an SVG donut slice arc path
function describeArc(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const toRadians = (deg: number) => ((deg - 90) * Math.PI) / 180.0;
  const startAngleRad = toRadians(startAngle);
  const endAngleRad = toRadians(endAngle);

  const x1 = x + outerRadius * Math.cos(startAngleRad);
  const y1 = y + outerRadius * Math.sin(startAngleRad);
  const x2 = x + outerRadius * Math.cos(endAngleRad);
  const y2 = y + outerRadius * Math.sin(endAngleRad);

  const x3 = x + innerRadius * Math.cos(endAngleRad);
  const y3 = y + innerRadius * Math.sin(endAngleRad);
  const x4 = x + innerRadius * Math.cos(startAngleRad);
  const y4 = y + innerRadius * Math.sin(startAngleRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

export function RotatingTriageVitalsPieChart({
  patientId,
  patientName,
}: RotatingTriageVitalsPieChartProps) {
  const vitals = React.useMemo(() => getPatientVitals(patientId), [patientId]);
  const [activeVitalIndex, setActiveVitalIndex] = React.useState<number>(0);
  const [isRotating, setIsRotating] = React.useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = React.useState<number>(0);

  // Smooth continuous rotation animation
  React.useEffect(() => {
    if (!isRotating) return;

    let animId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setRotationAngle((prev) => (prev + delta * 18) % 360); // 18 degrees/sec = smooth 20s full circle
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  const activeVital = vitals[activeVitalIndex] || vitals[0];
  const ActiveIcon = activeVital.icon;

  // 4 slices: 90 degrees each with a 4 degree gap
  const sliceAngles = [
    { start: 2, end: 88 },
    { start: 92, end: 178 },
    { start: 182, end: 268 },
    { start: 272, end: 358 },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#1E293B] bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0B1120] p-4 sm:p-5 shadow-xs transition-all overflow-hidden relative">
      {/* Subtle backdrop glow */}
      <div
        className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30 transition-colors duration-500"
        style={{ backgroundColor: activeVital.accentColor }}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-[#38BDF8] border border-[#DBEAFE] dark:border-[#1E293B]">
            <Activity className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                Recorded Triage Vitals &bull; Dynamic Telemetry
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                Rotating HUD
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Verified clinical telemetry recorded today at MediKiosk Pod 2 &bull; Interactive Telemetry Pie
            </p>
          </div>
        </div>

        {/* Animation & control toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs',
              isRotating
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200'
            )}
            title={isRotating ? 'Pause rotation' : 'Start continuous rotation'}
          >
            {isRotating ? (
              <>
                <Pause className="h-3 w-3 fill-current" />
                <span>Rotating Active</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Resume Rotate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setRotationAngle(0)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#1E293B] transition-colors cursor-pointer"
            title="Reset rotation angle"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Rotating Pie Chart (Left) + Interactive Triage Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* LEFT / CENTER: The Moving Rotated Pie Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none">
            {/* Outer Rotating Radar Ring */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 300"
              style={{
                transform: `rotate(${rotationAngle * 1.5}deg)`,
                transformOrigin: '150px 150px',
              }}
            >
              {/* Outer compass ring */}
              <circle
                cx="150"
                cy="150"
                r="138"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                className="text-sky-400/30 dark:text-sky-400/40"
              />
              {/* Outer satellites */}
              <circle cx="150" cy="12" r="4" fill="#38BDF8" className="animate-ping opacity-60" />
              <circle cx="150" cy="12" r="3" fill="#38BDF8" />
              <circle cx="150" cy="288" r="2.5" fill="#34D399" />
              <circle cx="12" cy="150" r="2.5" fill="#FB7185" />
              <circle cx="288" cy="150" r="2.5" fill="#FBBF24" />
            </svg>

            {/* Counter-rotating subtle grid ring */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 300"
              style={{
                transform: `rotate(${-rotationAngle * 0.8}deg)`,
                transformOrigin: '150px 150px',
              }}
            >
              <circle
                cx="150"
                cy="150"
                r="124"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 12"
                className="text-slate-300/40 dark:text-slate-600/40"
              />
            </svg>

            {/* MAIN PIE CHART SVG (Rotates smoothly with rotationAngle) */}
            <svg
              className="w-full h-full transition-transform duration-75 ease-linear drop-shadow-md"
              viewBox="0 0 300 300"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transformOrigin: '150px 150px',
              }}
            >
              <defs>
                {vitals.map((vital) => (
                  <linearGradient
                    key={vital.id}
                    id={`gradient-${vital.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={vital.gradient[0]} />
                    <stop offset="100%" stopColor={vital.gradient[1]} />
                  </linearGradient>
                ))}
                {/* Glow filter */}
                <filter id="glow-slice" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background circular track */}
              <circle
                cx="150"
                cy="150"
                r="110"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200/50 dark:text-slate-800/60"
              />

              {/* 4 Vitals Slices */}
              {vitals.map((vital, idx) => {
                const angle = sliceAngles[idx];
                const isSelected = activeVitalIndex === idx;
                const pathData = describeArc(150, 150, 68, isSelected ? 116 : 110, angle.start, angle.end);

                return (
                  <g key={vital.id} className="cursor-pointer">
                    <path
                      d={pathData}
                      fill={`url(#gradient-${vital.id})`}
                      opacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? '#ffffff' : 'transparent'}
                      strokeWidth={isSelected ? 2 : 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVitalIndex(idx);
                      }}
                      className="transition-all duration-200 hover:opacity-100"
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 10px ${vital.glowColor})` : undefined,
                      }}
                    />
                  </g>
                );
              })}

              {/* Inner ring bezel */}
              <circle
                cx="150"
                cy="150"
                r="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-300 dark:text-slate-700"
              />
            </svg>

            {/* STATIC HUD CENTER CORE (Counter-acts the rotation so text remains upright & readable) */}
            <div
              onClick={() => {
                // Cycle to next vital on click
                setActiveVitalIndex((prev) => (prev + 1) % vitals.length);
              }}
              className="absolute w-[116px] h-[116px] rounded-full bg-white dark:bg-[#0B152A] border-2 border-slate-200 dark:border-sky-500/40 shadow-xl flex flex-col items-center justify-center p-2 cursor-pointer z-20 group hover:scale-105 transition-transform"
              style={{
                boxShadow: `0 0 20px ${activeVital.glowColor}`,
              }}
              title="Click to cycle next vital parameter"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg mb-0.5 transition-colors"
                style={{ backgroundColor: `${activeVital.accentColor}20`, color: activeVital.accentColor }}
              >
                <ActiveIcon className="h-4 w-4" />
              </div>

              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 leading-tight text-center truncate max-w-[90px]">
                {activeVital.label.split(' ')[0]}
              </span>

              <div className="text-center leading-none mt-0.5">
                <span className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white tracking-tight">
                  {activeVital.value}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 ml-0.5">
                  {activeVital.unit}
                </span>
              </div>

              <span
                className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full mt-1 leading-none tracking-tight"
                style={{ backgroundColor: `${activeVital.accentColor}25`, color: activeVital.accentColor }}
              >
                {activeVital.status}
              </span>
            </div>
          </div>

          {/* Quick HUD indicator under chart */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <span
                className="h-2 w-2 rounded-full animate-ping"
                style={{ backgroundColor: activeVital.accentColor }}
              />
              Active: {activeVital.label}
            </span>
            <span>&bull;</span>
            <span className="text-slate-400">Click slices or cards to inspect</span>
          </div>
        </div>

        {/* RIGHT: The 4 Triage Vital Metric Cards with Hover Sync */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vitals.map((vital, idx) => {
            const isSelected = activeVitalIndex === idx;
            const Icon = vital.icon;

            return (
              <div
                key={vital.id}
                onClick={() => setActiveVitalIndex(idx)}
                onMouseEnter={() => setActiveVitalIndex(idx)}
                className={cn(
                  'group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden',
                  isSelected
                    ? 'border-2 bg-white dark:bg-[#1E293B] shadow-md -translate-y-0.5 ring-2'
                    : 'border-[#E2E8F0]/80 dark:border-[#1E293B] bg-slate-50/70 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                )}
                style={{
                  borderColor: isSelected ? vital.accentColor : undefined,
                  boxShadow: isSelected ? `0 4px 18px ${vital.glowColor}` : undefined,
                }}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: vital.accentColor }}
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${vital.accentColor}20`,
                        color: vital.accentColor,
                      }}
                    >
                      <Icon className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] truncate leading-none">
                        {vital.label}
                      </p>
                      <p className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC] leading-tight mt-1">
                        {vital.value}{' '}
                        <span className="text-[11px] font-normal text-[#64748B] dark:text-[#94A3B8]">
                          {vital.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={cn(
                      'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0',
                      vital.status === 'normal' || vital.status === 'optimal'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                    )}
                  >
                    {vital.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="truncate pr-1">{vital.statusText}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                    {isSelected ? 'Focused' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom telemetry detail callout */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 dark:border-[#1E293B]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {activeVital.label}:
          </span>
          <span className="text-[#64748B] dark:text-[#94A3B8]">
            {activeVital.description}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>Kiosk Sensor Calibration: OK</span>
          <span>&bull;</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            ABHA Integrated Vitals
          </span>
        </div>
      </div>
    </div>
  );
}
