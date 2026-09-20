'use client';

import * as React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';

const STORAGE_KEY = 'medikiosk_notification_preferences';

export function NotificationsSection() {
  const [notifications, setNotifications] = React.useState({
    appointmentReminders: true,
    queueUpdates: true,
    newPatientRegistration: false,
    consultationReminders: true,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Notifications</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Configure which notifications and alerts you receive</p>
      </div>

      <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
        <Toggle
          checked={notifications.appointmentReminders}
          onChange={(v) => updateNotification('appointmentReminders', v)}
          label="Appointment reminders"
          description="Receive reminders before upcoming appointments"
        />
        <Toggle
          checked={notifications.queueUpdates}
          onChange={(v) => updateNotification('queueUpdates', v)}
          label="Queue updates"
          description="Get notified when patients join or leave the queue"
        />
        <Toggle
          checked={notifications.newPatientRegistration}
          onChange={(v) => updateNotification('newPatientRegistration', v)}
          label="New patient registration"
          description="Receive alerts when new patients register"
        />
        <Toggle
          checked={notifications.consultationReminders}
          onChange={(v) => updateNotification('consultationReminders', v)}
          label="Consultation reminders"
          description="Reminders to complete pending consultations"
        />
      </div>
    </div>
  );
}
