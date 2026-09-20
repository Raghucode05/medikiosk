'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { DocumentFilter } from '@/types/patient';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DocumentsPanel() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const {
    patients,
    getSelectedPatient,
    documentFilter,
    setDocumentFilter,
    getFilteredDocuments,
  } = usePatientStore();

  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();
  const filteredDocs = patient ? (
    documentFilter === 'all'
      ? patient.documents
      : documentFilter === 'lab-reports'
      ? patient.documents.filter((d) => d.type === 'lab-report')
      : documentFilter === 'prescriptions'
      ? patient.documents.filter((d) => d.type === 'prescription')
      : patient.documents.filter((d) => d.type === 'other')
  ) : [];

  if (!patient) return null;

  const filters: { key: DocumentFilter; label: string }[] = [
    { key: 'all', label: `All (${patient.documents.length})` },
    { key: 'lab-reports', label: 'Lab Reports' },
    { key: 'prescriptions', label: 'Prescriptions' },
    { key: 'others', label: 'Others' },
  ];

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
          <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Documents</h3>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const isActive = documentFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setDocumentFilter(f.key)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold transition-all shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B]'
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto space-y-3">
        {filteredDocs.map((doc) => {
          const isPrescription = doc.type === 'prescription';
          return (
            <div
              key={doc.id}
              onClick={() => toast.info(`Viewing ${doc.title}`)}
              className="group p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] hover:border-[#1E3A8A]/50 hover:bg-[#EFF6FF]/40 dark:hover:bg-[#1E293B]/80 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="relative flex flex-col justify-between w-14 h-20 shrink-0 bg-white dark:bg-[#0F172A] border border-slate-300/80 dark:border-slate-700 rounded-md p-1.5 shadow-2xs group-hover:border-[#1E3A8A]/60 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-[7px] font-bold text-[#1E3A8A] dark:text-sky-400 leading-none">
                      {isPrescription ? 'Rx' : 'LAB'}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  </div>

                  <div className="space-y-1 py-1">
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-xs" />
                    <div className="h-1 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                    <div className="h-1 w-3/5 bg-slate-300/70 dark:bg-slate-600 rounded-xs" />
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-xs" />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-0.5 text-[6px] text-slate-400 font-mono">
                    <span>SEAL</span>
                    <span className="text-emerald-600 font-bold">&check;</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate group-hover:text-[#1E3A8A] transition-colors">
                      {doc.title}
                    </p>
                    <ChevronRight className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                  </div>
                  <p className="text-xs font-bold text-[#1E3A8A] dark:text-sky-400 mt-0.5">Extracted Data</p>

                  <div className="mt-1 space-y-0.5 text-xs bg-slate-50/70 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {doc.extractedData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[#0F172A] dark:text-[#F8FAFC]">
                        <span className="text-[#64748B] dark:text-[#94A3B8] text-xs truncate max-w-[105px]">
                          {item.label}
                        </span>
                        <span className="font-semibold text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {patient.alerts.length > 0 && (
          <div className="rounded-xl border border-[#F8C8C7] bg-[#FEECEB] p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-rose-700 mb-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 stroke-[2.5]" />
              <span className="text-sm font-bold">High Alert</span>
            </div>
            <ul className="space-y-1 text-sm text-rose-900 pl-5 list-disc">
              {patient.alerts.map((alert) => (
                <li key={alert.id} className="font-medium text-sm leading-tight">
                  {alert.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
