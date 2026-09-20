'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Play, Eye, CheckCircle, Clock, X, ArrowRight } from 'lucide-react';
import { QueuePatient, QueueStatus } from '@/types/queue';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { FilterTabs } from '@/components/ui/filter-tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QueueTableProps {
  patients: QueuePatient[];
  onStatusChange?: (patientId: string, newStatus: QueueStatus) => void;
}

const filterTabs = [
  { key: 'all', label: 'All Queue' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'in-consultation', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

function getActionForStatus(status: QueueStatus) {
  switch (status) {
    case 'waiting':
      return { label: 'Start Consultation', icon: Play, variant: 'default' as const };
    case 'in-consultation':
      return { label: 'Complete Visit', icon: CheckCircle, variant: 'default' as const };
    case 'completed':
      return { label: 'View Chart', icon: Eye, variant: 'outline' as const };
  }
}

export function QueueTable({ patients, onStatusChange }: QueueTableProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showToken, setShowToken] = React.useState(true);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('medikiosk_queue_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.showToken === 'boolean') {
          setShowToken(parsed.showToken);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredPatients = React.useMemo(() => {
    let result = patients;

    if (activeFilter !== 'all') {
      result = result.filter((p) => p.status === activeFilter);
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.token.toLowerCase().includes(q)
      );
    }

    return result;
  }, [patients, activeFilter, searchQuery]);

  const handleAction = async (patient: QueuePatient) => {
    if (patient.status === 'waiting') {
      const newStatus: QueueStatus = 'in-consultation';
      toast.success(`Consultation started for ${patient.name}`, {
        description: `Token #${patient.token} • Status updated in SQLite database`,
      });
      if (onStatusChange) {
        onStatusChange(patient.id, newStatus);
      }
      try {
        await fetch(`/api/queue/${patient.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {
        console.error('Failed to update status in SQLite:', err);
      }
    } else if (patient.status === 'in-consultation') {
      const newStatus: QueueStatus = 'completed';
      toast.success(`Consultation completed for ${patient.name}`, {
        description: `Token #${patient.token} marked as completed in SQLite`,
      });
      if (onStatusChange) {
        onStatusChange(patient.id, newStatus);
      }
      try {
        await fetch(`/api/queue/${patient.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {
        console.error('Failed to update status in SQLite:', err);
      }
    } else {
      router.push(`/patients/${patient.id}`);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0]/80 dark:border-[#1E293B] overflow-hidden card-subtle">
      {/* Queue Header & Filters */}
      <div className="p-4 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                Live Consultation Queue
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8]">
                {filteredPatients.length} active
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Patients queued according to arrival time &amp; triage priority
            </p>
          </div>

          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 bg-slate-50/80 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-xs placeholder:text-[#64748B]/70 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
            placeholder="Search patient by name, token number, or consultation type..."
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

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]/40 dark:divide-[#1E293B]/40">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const action = getActionForStatus(patient.status);
            const ActionIcon = action.icon;

            return (
              <div
                key={patient.id}
                onClick={() => router.push(`/patients/${patient.id}`)}
                className="group flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                  {/* Token */}
                  {showToken && (
                    <div className="flex flex-col items-center justify-center w-11 shrink-0 py-1 px-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#1E293B] text-center">
                      <span className="text-[9px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] leading-none">
                        Token
                      </span>
                      <span className="text-sm font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">
                        #{patient.token}
                      </span>
                    </div>
                  )}

                  {/* Avatar */}
                  <PatientAvatar
                    id={patient.id}
                    name={patient.name}
                    gender={patient.gender}
                    size="md"
                    className="border border-slate-200 dark:border-slate-700 shadow-2xs"
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate leading-tight group-hover:text-[#1E3A8A] transition-colors">
                        {patient.name}
                      </p>
                      <StatusBadge status={patient.status} className="hidden sm:inline-flex" />
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate leading-tight mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {patient.type}
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {patient.time}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  variant={action.variant}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(patient);
                  }}
                  className="ml-3 shrink-0 gap-1.5 font-bold rounded-xl shadow-xs"
                >
                  <ActionIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No patients found in queue"
            description={
              searchQuery
                ? `No patients matching "${searchQuery}". Try a different token or name.`
                : 'There are currently no patients in this queue status category.'
            }
          />
        )}
      </div>
    </div>
  );
}
