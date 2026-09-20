'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MainTab } from '@/types/patient';
import { usePatientStore } from '@/store/patientStore';

export const PATIENT_TABS = [
  { key: 'summary', label: 'Summary' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'documents', label: 'Documents' },
  { key: 'alerts', label: 'Alerts' },
] as const;

interface PatientTabsProps {
  activeTab: MainTab;
  patientId: string;
}

export function PatientTabs({ activeTab, patientId }: PatientTabsProps) {
  const router = useRouter();
  const { setActiveTab } = usePatientStore();

  const handleTabClick = (tabKey: MainTab) => {
    setActiveTab(tabKey);
    if (tabKey === 'summary') router.push(`/patients/${patientId}`);
    if (tabKey === 'timeline') router.push(`/patients/${patientId}/timeline`);
    if (tabKey === 'documents') router.push(`/patients/${patientId}/documents`);
    if (tabKey === 'alerts') router.push(`/patients/${patientId}/alerts`);
  };

  return (
    <div className="border-b border-[#E2E8F0]/80 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-4 py-2.5">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {PATIENT_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab.key)}
              className={cn(
                'px-5 sm:px-6 py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-[#0F172A] dark:text-[#CBD5E1] hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
