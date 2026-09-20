'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  FlaskConical,
  Calendar,
  ShieldAlert,
  Users,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Weight,
  Edit2,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { Patient } from '@/types/patient';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VitalItemProps {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'optimal';
  icon: React.ElementType;
}

function VitalItem({ label, value, unit, status, icon: Icon }: VitalItemProps) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E2E8F0]/70 dark:border-[#1E293B] bg-slate-50/70 dark:bg-slate-900/50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] text-[#1E3A8A]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider leading-none">
          {label}
        </p>
        <p className="text-sm font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight mt-0.5">
          {value} <span className="text-[10px] font-normal text-[#64748B] dark:text-[#94A3B8]">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function SummaryEditor({ patient }: { patient: Patient }) {
  const [complaintText, setComplaintText] = React.useState(patient.chiefComplaint);
  const [hpiText, setHpiText] = React.useState(patient.hpiText);

  React.useEffect(() => {
    setComplaintText(patient.chiefComplaint);
    setHpiText(patient.hpiText);
  }, [patient.id, patient.chiefComplaint, patient.hpiText]);

  const {
    summaryEditing,
    toggleSummaryEditing,
    updateSummary,
    expandedHistoryItems,
    toggleHistoryItem,
  } = usePatientStore();

  const getHistoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical':
        return <FlaskConical className="h-4 w-4 text-[#1E3A8A]" />;
      case 'Calendar':
        return <Calendar className="h-4 w-4 text-[#1E3A8A]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      case 'Users':
        return <Users className="h-4 w-4 text-[#1E3A8A]" />;
      default:
        return <Activity className="h-4 w-4 text-[#1E3A8A]" />;
    }
  };

  const handleSaveEdit = () => {
    updateSummary(complaintText, hpiText);
    toast.success('Clinical summary updated successfully');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#0F172A]" key={patient.id}>
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {/* Chief Complaint */}
        <div className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#1E293B] bg-slate-50/40 dark:bg-slate-900/30 p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A]">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                Chief Complaint
              </h4>
            </div>

            {!summaryEditing && (
              <button
                type="button"
                onClick={toggleSummaryEditing}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E3A8A] hover:text-[#172554] transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Note</span>
              </button>
            )}
          </div>

          {summaryEditing ? (
            <input
              type="text"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full rounded-xl border border-[#1E3A8A] bg-white dark:bg-[#1E293B] px-3.5 py-2.5 text-base text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
            />
          ) : (
            <p className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed">
              {patient.chiefComplaint}
            </p>
          )}
        </div>

        {/* History of Present Illness (HPI) */}
        <div className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#1E293B] bg-slate-50/40 dark:bg-slate-900/30 p-4 transition-all">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-2.5">
            History of Present Illness (HPI)
          </h4>

          {summaryEditing ? (
            <div className="space-y-3">
              <textarea
                value={hpiText}
                onChange={(e) => setHpiText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#1E3A8A] bg-white dark:bg-[#1E293B] px-3.5 py-2.5 text-base text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 leading-relaxed"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={toggleSummaryEditing}
                  className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] px-4 py-2 text-sm font-bold text-[#64748B] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] px-4.5 py-2 text-sm font-bold text-white shadow-xs transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              {patient.hpiText}
            </p>
          )}
        </div>

        {/* Longitudinal Medical History */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-3">
            Verified Longitudinal Medical History
          </h4>

          <div className="space-y-2.5">
            {patient.medicalHistory.map((item) => {
              const isExpanded = expandedHistoryItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleHistoryItem(item.id)}
                  className="flex cursor-pointer flex-col rounded-2xl border border-[#E2E8F0]/70 dark:border-[#1E293B] bg-white dark:bg-[#1E293B] p-3.5 transition-all duration-150 hover:border-[#1E3A8A]/50 hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#EFF6FF] dark:bg-[#0F172A]">
                        {getHistoryIcon(item.icon)}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-[#64748B] dark:text-[#94A3B8]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 text-[#64748B] transition-transform duration-200',
                        isExpanded && 'rotate-90 text-[#1E3A8A]'
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 rounded-xl border border-[#E2E8F0]/60 dark:border-[#1E293B] bg-slate-50 dark:bg-slate-900/60 p-3.5 text-sm text-[#0F172A]/90 dark:text-slate-200">
                      <p className="font-bold text-[#1E3A8A] mb-1">Clinical Documentation Note:</p>
                      <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        Verified longitudinal record from state health repository. Previous diagnosis and medication history actively integrated into current triage profile.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PatientSummary() {
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const { patients, getSelectedPatient } = usePatientStore();
  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();

  if (!patient) return null;

  return <SummaryEditor patient={patient} />;
}
