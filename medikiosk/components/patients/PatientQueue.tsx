'use client';

import * as React from 'react';
import { Search, X, Users, Filter, UserPlus } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { PatientListItem } from './PatientListItem';
import { NewPatientDialog } from './NewPatientDialog';
import { cn } from '@/lib/utils';

export function PatientQueue() {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredPatients,
    selectedPatientId,
    selectPatient,
    fetchPatients,
  } = usePatientStore();

  const [activeFilter, setActiveFilter] = React.useState<'all' | 'waiting' | 'completed'>('all');
  const [newPatientOpen, setNewPatientOpen] = React.useState(false);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const allFiltered = getFilteredPatients();

  const patients = React.useMemo(() => {
    if (activeFilter === 'waiting') {
      return allFiltered.filter((p) => !p.status || p.status === 'waiting');
    }
    if (activeFilter === 'completed') {
      return allFiltered.filter((p) => p.status === 'completed');
    }
    return allFiltered;
  }, [allFiltered, activeFilter]);

  return (
    <section className="flex flex-col h-full bg-white dark:bg-[#0F172A]">
      {/* Header & Search Bar */}
      <div className="px-4 py-3 border-b border-[#E2E8F0]/80 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Patient Consultation Queue
            </h2>
            <span className="text-xs font-bold text-[#1E3A8A] dark:text-sky-300 bg-[#EFF6FF] dark:bg-[#1E293B] px-2.5 py-0.5 rounded-full border border-[#DBEAFE] dark:border-[#334155]">
              {patients.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* New Patient Button */}
            <button
              type="button"
              onClick={() => setNewPatientOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>New Patient</span>
            </button>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                activeFilter === 'all'
                  ? 'bg-white dark:bg-[#1E293B] text-[#1E3A8A] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A]'
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('waiting')}
              className={cn(
                'px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                activeFilter === 'waiting'
                  ? 'bg-white dark:bg-[#1E293B] text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A]'
              )}
            >
              Waiting
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('completed')}
              className={cn(
                'px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                activeFilter === 'completed'
                  ? 'bg-white dark:bg-[#1E293B] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A]'
              )}
            >
              Done
            </button>
          </div>
        </div>
      </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50/90 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-sm placeholder:text-[#64748B]/70 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
            placeholder="Search by patient name, ABHA ID number, or token #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]/40 dark:divide-[#1E293B]/40">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PatientListItem
              key={patient.id}
              patient={patient}
              isSelected={selectedPatientId === patient.id}
              onSelect={selectPatient}
            />
          ))
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">No patients found</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-xs">
              {searchQuery ? `No matching records for "${searchQuery}".` : 'No patients currently in this filter view.'}
            </p>
          </div>
        )}
      </div>

      <NewPatientDialog
        open={newPatientOpen}
        onOpenChange={setNewPatientOpen}
      />
    </section>
  );
}
