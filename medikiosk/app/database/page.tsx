'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Database,
  Table as TableIcon,
  RefreshCw,
  Search,
  FileCode,
  ShieldCheck,
  Key,
  ArrowLeft,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TableMeta {
  name: string;
  count: number;
  columns: {
    name: string;
    type: string;
    isPk: boolean;
    notNull: boolean;
  }[];
}

export default function StandaloneDatabasePage() {
  const [tables, setTables] = React.useState<TableMeta[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<string>('patients');
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showSchema, setShowSchema] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  const fetchTableData = React.useCallback(async (tableName: string, showToast = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/database?table=${encodeURIComponent(tableName)}&all=1`);
      const json = await res.json();
      if (json.success) {
        setTables(json.tables || []);
        setSelectedTable(json.activeTable || tableName);
        setRows(json.rows || []);
        if (showToast) {
          toast.success(`Loaded table "${tableName}"`, {
            description: `${json.rows?.length || 0} rows retrieved from SQLite.`,
          });
        }
      }
    } catch (e) {
      console.error('Failed to load database view:', e);
      toast.error('Failed to query SQLite database');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTableData(selectedTable);
  }, [fetchTableData, selectedTable]);

  const activeTableMeta = tables.find((t) => t.name === selectedTable);

  const filteredRows = React.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(q)
      )
    );
  }, [rows, searchQuery]);

  const columns = activeTableMeta?.columns || [];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    setCopied(true);
    toast.success('JSON data copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    if (rows.length === 0 || columns.length === 0) return;
    const header = columns.map((c) => `"${c.name}"`).join(',');
    const body = rows.map((r) =>
      columns.map((c) => {
        const val = r[c.name];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedTable}.csv`);
  };

  const totalRecordsAllTables = React.useMemo(
    () => tables.reduce((acc, t) => acc + (t.count || 0), 0),
    [tables]
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F1F5F9] overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-[#EFF6FF] hover:text-[#1E3A8A] dark:hover:bg-slate-700 transition-colors"
            title="Return to Main Workstation"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Workstation</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white shadow-xs">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  MediKiosk SQLite Database Explorer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 border border-[#DBEAFE] dark:border-[#334155]">
                  <ShieldCheck className="h-3 w-3" />
                  WAL Mode
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] hidden md:block">
                File: <code className="font-mono text-slate-700 dark:text-slate-300">data/medikiosk.db</code> &bull; {tables.length} tables &bull; {totalRecordsAllTables} total records
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hidden sm:inline-flex"
            title="Copy current table rows as JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'JSON'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hidden sm:inline-flex"
            title="Download table as CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>CSV</span>
          </Button>

          <Button
            variant={showSchema ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowSchema(!showSchema)}
            className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{showSchema ? 'Hide Schema' : 'Schema'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTableData(selectedTable, true)}
            disabled={loading}
            className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin text-[#1E3A8A] dark:text-[#60A5FA]')} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Table Rail */}
        <aside className="w-56 sm:w-64 shrink-0 border-r border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-3 flex flex-col gap-1 overflow-y-auto">
          <div className="px-2 py-1 mb-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Tables ({tables.length})
            </p>
          </div>

          {tables.map((table) => {
            const isSelected = table.name === selectedTable;
            return (
              <button
                key={table.name}
                type="button"
                onClick={() => {
                  setSelectedTable(table.name);
                  setSearchQuery('');
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <TableIcon className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-white' : 'text-slate-400')} />
                  <span className="truncate font-mono">{table.name}</span>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0 leading-none',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {table.count}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right Data Explorer Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden">
          {/* Query Toolbar */}
          <div className="p-3 border-b border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0F172A]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#1E293B] truncate">
                SELECT * FROM {selectedTable}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] shrink-0">
                {filteredRows.length} of {activeTableMeta?.count || 0} rows
              </span>
            </div>

            <div className="relative w-64 max-w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl text-xs text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Schema Drawer */}
          {showSchema && activeTableMeta && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border-b border-[#E2E8F0] dark:border-[#1E293B] max-h-48 overflow-y-auto">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Schema Definition: <span className="font-mono text-[#1E3A8A] dark:text-sky-400">{selectedTable}</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {activeTableMeta.columns.map((col) => (
                  <div
                    key={col.name}
                    className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {col.isPk && <Key className="h-3 w-3 text-amber-500 shrink-0" />}
                      <span className="font-mono font-bold truncate text-[#0F172A] dark:text-slate-200" title={col.name}>
                        {col.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#1E3A8A] dark:text-[#60A5FA] uppercase shrink-0">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Records Table View */}
          <div className="flex-1 overflow-auto bg-white dark:bg-[#0F172A]">
            {loading ? (
              <div className="flex items-center justify-center h-64 gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-[#1E3A8A] dark:text-[#60A5FA]" />
                <span className="text-xs font-semibold text-slate-500">Querying SQLite database...</span>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <TableIcon className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-semibold">No records found</p>
                {searchQuery && (
                  <p className="text-[11px] mt-1 text-slate-500">No rows match &quot;{searchQuery}&quot;</p>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/90 sticky top-0 z-10 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.name}
                        className="px-3.5 py-2.5 font-bold text-slate-700 dark:text-slate-200 border-r border-[#E2E8F0]/80 dark:border-[#1E293B] last:border-r-0 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          {col.isPk && <Key className="h-3 w-3 text-amber-500" />}
                          <span>{col.name}</span>
                          <span className="text-[9px] font-normal text-slate-400 font-mono">({col.type})</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/80 dark:divide-[#1E293B] font-mono text-[11px]">
                  {filteredRows.map((row, rowIdx) => (
                    <tr
                      key={row.id || rowIdx}
                      className="hover:bg-[#EFF6FF]/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {columns.map((col) => {
                        const val = row[col.name];
                        const isNull = val === null || val === undefined;
                        const isJson = typeof val === 'string' && (val.startsWith('{') || val.startsWith('['));

                        return (
                          <td
                            key={col.name}
                            className="px-3.5 py-2 border-r border-[#E2E8F0]/60 dark:border-[#1E293B] last:border-r-0 max-w-xs truncate text-[#0F172A] dark:text-slate-200"
                            title={String(val ?? 'NULL')}
                          >
                            {isNull ? (
                              <span className="text-slate-400 italic">NULL</span>
                            ) : isJson ? (
                              <span className="text-amber-600 dark:text-amber-400 truncate block">
                                {val}
                              </span>
                            ) : (
                              <span>{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
