'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Menu, ShieldCheck, Minus, Plus } from 'lucide-react';
import { SettingsSidebar, type SettingsSection } from '@/components/settings/SettingsSidebar';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { ClinicSection } from '@/components/settings/ClinicSection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { QueuePreferencesSection } from '@/components/settings/QueuePreferencesSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { useAppearanceStore } from '@/store/appearanceStore';
import { usePatientStore } from '@/store/patientStore';
import { toast } from 'sonner';

const sectionComponents: Record<SettingsSection, React.ComponentType> = {
  profile: ProfileSection,
  clinic: ClinicSection,
  notifications: NotificationsSection,
  queue: QueuePreferencesSection,
  appearance: AppearanceSection,
  security: SecuritySection,
};

const validSections: SettingsSection[] = [
  'profile',
  'clinic',
  'notifications',
  'queue',
  'appearance',
  'security',
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as SettingsSection | null;
  const [activeSection, setActiveSection] = React.useState<SettingsSection>(
    initialTab && validSections.includes(initialTab) ? initialTab : 'profile'
  );

  const toggleSidebar = usePatientStore((state) => state.toggleSidebar);
  const textSize = useAppearanceStore((state) => state.textSize);
  const increaseTextSize = useAppearanceStore((state) => state.increaseTextSize);
  const decreaseTextSize = useAppearanceStore((state) => state.decreaseTextSize);

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', section);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const ActiveComponent = sectionComponents[activeSection] || ProfileSection;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3">
        <header className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 pt-1 border-b border-[#E2E8F0]/70 dark:border-[#1E293B] mb-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    Doctor Consultation Workstation
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 border border-[#DBEAFE] dark:border-[#334155]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    ABHA Verified Clinic
                  </span>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 hidden sm:block">
                  Workstation Settings &bull; Color Theme &bull; Text Zoom &bull; Clinic Preferences
                </p>
              </div>
            </div>

            {/* Quick Global Text Size Stepper */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-[#E2E8F0] dark:border-[#334155] shadow-2xs" title="Adjust Global Text Size (Zoom)">
              <button
                type="button"
                onClick={() => {
                  decreaseTextSize(5);
                  toast.info(`Text size: ${Math.max(70, textSize - 5)}%`);
                }}
                disabled={textSize <= 70}
                className="h-6 w-6 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
                title="Decrease text size (-5%)"
                aria-label="Decrease text size"
              >
                <Minus className="h-3 w-3 stroke-[3]" />
              </button>
              <span className="text-xs font-black text-[#1E3A8A] dark:text-sky-300 min-w-[40px] text-center select-none">
                {textSize}%
              </span>
              <button
                type="button"
                onClick={() => {
                  increaseTextSize(5);
                  toast.info(`Text size: ${Math.min(160, textSize + 5)}%`);
                }}
                disabled={textSize >= 160}
                className="h-6 w-6 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white font-bold text-xs disabled:opacity-35 cursor-pointer shadow-2xs transition-all active:scale-95"
                title="Increase text size (+5%)"
                aria-label="Increase text size"
              >
                <Plus className="h-3 w-3 stroke-[3]" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1E3A8A] dark:border-[#3B82F6] border-t-transparent" />
        </div>
      }
    >
      <SettingsContent />
    </React.Suspense>
  );
}
