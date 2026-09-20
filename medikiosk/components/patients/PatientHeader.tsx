'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, History, ShieldCheck, Phone, AlertTriangle, UserCheck, Stethoscope } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { toast } from 'sonner';

export function PatientHeader() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const { patients, getSelectedPatient, setActiveTab } = usePatientStore();
  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();

  if (!patient) return null;

  const handleFullHistory = () => {
    setActiveTab('timeline');
    router.push(`/patients/${patient.id}/timeline`);
  };

  const handleCallPatient = () => {
    toast.success(`Calling ${patient.name} to Consultation Room 204`, {
      description: `Token #${patient.token} notification sent to waiting kiosk display.`,
    });
  };

  const highSeverityAlert = patient.alerts?.find((a) => a.severity === 'high');

  return (
    <div className="p-4 border-b border-[#E2E8F0]/80 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
      {/* Top navigation row */}
      <div className="flex items-center justify-between mb-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] bg-slate-100 dark:bg-slate-800 hover:bg-[#EFF6FF] hover:text-[#1E3A8A] transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to Patient List</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCallPatient}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Call to Room 204</span>
          </button>
          <button
            type="button"
            onClick={handleFullHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#1E3A8A] rounded-xl text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] transition-all cursor-pointer"
          >
            <History className="h-4 w-4 text-[#64748B]" />
            <span className="hidden sm:inline">EHR Timeline</span>
          </button>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <PatientAvatar
              id={patient.id}
              name={patient.name}
              gender={patient.gender}
              size="lg"
              className="ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-sm"
            />
            {patient.abhaLinked && (
              <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                <ShieldCheck className="h-3 w-3 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight truncate">
                {patient.name}
              </h2>
              {patient.abhaLinked && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                  ABHA Linked
                </span>
              )}
              <span className="text-sm font-bold text-[#1E3A8A] dark:text-sky-300 bg-[#EFF6FF] dark:bg-[#1E293B] px-2.5 py-1 rounded-lg border border-[#DBEAFE] dark:border-[#334155]">
                Token #{patient.token}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#64748B] dark:text-[#94A3B8] mt-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {patient.gender}, {patient.age} years
              </span>
              <span>&bull;</span>
              <span>Blood Group: <strong className="text-slate-800 dark:text-white">B+</strong></span>
              <span>&bull;</span>
              <span>Appt: <strong>{patient.appointmentTime}</strong></span>
            </div>
          </div>
        </div>

        {/* Clinical alerts if present */}
        {highSeverityAlert && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-bold shadow-2xs">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
            <span>{highSeverityAlert.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
