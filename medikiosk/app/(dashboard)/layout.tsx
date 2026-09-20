'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  React.useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen clinical-mesh flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#1E3A8A] border-t-transparent" />
          <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Loading consultation suite...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="h-screen w-screen min-h-screen overflow-hidden text-[#0F172A] dark:text-[#F8FAFC] flex flex-row bg-white dark:bg-[#0F172A]">
      <Sidebar />
      <div className="min-w-0 flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0F172A]">
        {children}
      </div>
    </main>
  );
}
