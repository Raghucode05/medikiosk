'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  Settings,
  Plus,
  X,
  LogOut,
  Tv,
} from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { useAuthStore } from '@/store/authStore';
import { useAppearanceStore } from '@/store/appearanceStore';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Ordered with "Waiting Room" at top and "Patients" at second
const navItems = [
  {
    name: 'Waiting Room',
    icon: Tv,
    href: '/waiting',
  },
  {
    name: 'Patients',
    icon: Users,
    href: '/',
  },
  {
    name: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function Sidebar() {
  const textSize = useAppearanceStore((state) => state.textSize) || 100;
  // Layout of sidebar increases proportionally according to page text size option
  const sidebarWidth = Math.max(200, Math.round((230 * textSize) / 100));

  const sidebarOpen = usePatientStore((state) => state.sidebarOpen);
  const toggleSidebar = usePatientStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    usePatientStore.getState().resetPatients();
    toast.success('Logged out successfully', {
      description: 'Session ended. Redirecting to admin login...',
    });
    router.replace('/login');
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }, 150);
  };

  const doctorName = user?.name || 'Dr. Sharma';
  const doctorRoom = user?.room || 'Room 204';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/patients');
    return pathname.startsWith(href);
  };

  const renderSidebar = (isMobileDrawer: boolean = false) => (
    <div className="flex h-full flex-col justify-between text-white p-3.5 relative select-none">
      {/* Ambient background glow accents */}
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-16 -right-16 w-32 h-32 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Brand Header */}
        <div className="flex items-center pb-4 pt-1 border-b border-white/[0.08] mb-4 justify-between px-1">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" title="MediKiosk Clinical Suite">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-blue-900/30 transition-transform duration-200 group-hover:scale-105">
              <Plus className="h-4.5 w-4.5 stroke-[3]" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  MediKiosk
                </span>
                <span className="inline-block px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wide uppercase border border-blue-400/20">
                  Pro
                </span>
              </div>
              <span className="text-xs font-medium tracking-wider text-slate-400 block leading-none mt-1">
                Clinical Suite
              </span>
            </div>
          </Link>
          {isMobileDrawer && (
            <button
              onClick={toggleSidebar}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Section Label */}
        <div className="px-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400/70">
            Navigation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (sidebarOpen) toggleSidebar();
                }}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl py-2.5 px-3 text-sm font-semibold transition-all duration-200 cursor-pointer overflow-hidden',
                  active
                    ? 'bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white font-bold shadow-lg shadow-blue-900/30 ring-1 ring-white/15'
                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                )}
              >
                {/* Active left indicator pill */}
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white shadow-xs" />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                      active
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'bg-white/[0.05] text-slate-400 group-hover:bg-white/[0.1] group-hover:text-white'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="truncate block font-semibold leading-tight">{item.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: Doctor Profile & Sign Out */}
      <div className="relative z-10 pt-3 border-t border-white/[0.08] space-y-2">
        {/* Doctor Card */}
        <div
          className="flex items-center rounded-xl p-2.5 transition-all bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] gap-2.5"
          title={`${doctorName} - ${user?.specialization || 'Consultant Physician'} (On Duty)`}
        >
          <div className="shrink-0">
            <PatientAvatar
              name={doctorName}
              size="sm"
              className="border-white/20 ring-1 ring-white/30 shrink-0"
            />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-white leading-tight">{doctorName}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center text-xs sm:text-sm font-semibold text-rose-300/80 hover:text-rose-100 hover:bg-rose-500/20 rounded-xl p-2.5 transition-all cursor-pointer w-full justify-between px-3 border border-transparent hover:border-rose-500/30"
          title="Sign Out to Login Portal"
        >
          <span className="font-semibold">Sign Out</span>
          <LogOut className="h-4 w-4 shrink-0 text-rose-400" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        style={{
          width: Math.min(sidebarWidth, 320),
        }}
        className={cn(
          'sidebar-fixed-text fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#0A1120] via-[#0F172A] to-[#070D19] shadow-2xl transition-transform duration-300 md:hidden border-r border-white/10',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {renderSidebar(true)}
      </aside>

      {/* Desktop Sidebar - Fixed text size, layout scales with page text size option */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
        }}
        className="sidebar-fixed-text hidden md:flex flex-col shrink-0 min-w-0 bg-gradient-to-b from-[#0A1120] via-[#0F172A] to-[#070D19] h-full self-stretch overflow-hidden border-r border-white/[0.08] transition-[width] duration-150"
      >
        {renderSidebar(false)}
      </aside>
    </>
  );
}
