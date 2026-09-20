'use client';

import * as React from 'react';
import { Search as SearchIcon, X, Filter, FileSearch } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import { Button } from '@/components/ui/button';
import { QueuePatient } from '@/types/queue';

const searchByOptions = [
  { key: 'all', label: 'All' },
  { key: 'name', label: 'Name' },
  { key: 'abha', label: 'ABHA ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'token', label: 'Token' },
];

const statusOptions = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const dateOptions = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'custom', label: 'Custom' },
];

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [activeSearchBy, setActiveSearchBy] = React.useState('all');
  const [activeStatus, setActiveStatus] = React.useState('all');
  const [activeDate, setActiveDate] = React.useState('today');
  const [showFilters, setShowFilters] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [patients, setPatients] = React.useState<QueuePatient[]>([]);

  React.useEffect(() => {
    fetch('/api/queue')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data?.patients)) {
          setPatients(json.data.patients);
        }
      })
      .catch(() => {});
  }, []);

  const filteredResults = React.useMemo(() => {
    if (!hasSearched && !query.trim()) return [];

    let results: QueuePatient[] = patients;

    // Filter by search query and search type
    const q = query.toLowerCase().trim();
    if (q) {
      results = results.filter((p) => {
        switch (activeSearchBy) {
          case 'name':
            return p.name.toLowerCase().includes(q);
          case 'abha':
            return p.abhaId?.toLowerCase().includes(q);
          case 'phone':
            return p.phone?.toLowerCase().includes(q);
          case 'token':
            return p.token.toLowerCase().includes(q);
          default:
            return (
              p.name.toLowerCase().includes(q) ||
              p.abhaId?.toLowerCase().includes(q) ||
              p.phone?.toLowerCase().includes(q) ||
              p.token.toLowerCase().includes(q)
            );
        }
      });
    }

    // Filter by status
    if (activeStatus !== 'all') {
      if (activeStatus === 'active') {
        results = results.filter(
          (p) => p.status === 'waiting' || p.status === 'in-consultation'
        );
      } else if (activeStatus === 'completed') {
        results = results.filter((p) => p.status === 'completed');
      }
    }

    return results;
  }, [query, activeSearchBy, activeStatus, hasSearched]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setHasSearched(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3">
        <PageHeader
          title="Search Patients"
          subtitle="Find patients by name, ABHA ID, phone number, or token"
        />
      </div>

      {/* Search input */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
          <input
            type="text"
            className="w-full pl-9 pr-20 py-2.5 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-sm placeholder:text-[#64748B]/70 dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] dark:focus:ring-[#3B82F6] dark:focus:border-[#3B82F6] transition-all shadow-xs"
            placeholder="Search by patient name, ABHA ID, phone number or token..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <SearchFilters
          searchByOptions={searchByOptions}
          activeSearchBy={activeSearchBy}
          onSearchByChange={setActiveSearchBy}
          statusOptions={statusOptions}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          dateOptions={dateOptions}
          activeDate={activeDate}
          onDateChange={setActiveDate}
        />
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto border-t border-[#E2E8F0] dark:border-[#1E293B] mt-2">
        {!hasSearched && !query.trim() ? (
          <EmptyState
            icon={<FileSearch className="h-5 w-5" />}
            title="Search for a patient to view records"
            description="Use the search bar above to find patients by name, ABHA ID, phone number, or token"
          />
        ) : filteredResults.length > 0 ? (
          <div>
            <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {filteredResults.map((patient) => (
              <SearchResultCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<SearchIcon className="h-5 w-5" />}
            title="No results found"
            description={`No patients matching "${query}"`}
          >
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear search
            </Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
