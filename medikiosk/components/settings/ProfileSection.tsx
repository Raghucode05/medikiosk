'use client';

import * as React from 'react';
import { PatientAvatar } from '@/components/ui/patient-avatar';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const STORAGE_KEY = 'medikiosk_profile_info';

export function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [editing, setEditing] = React.useState(true);
  const [form, setForm] = React.useState({
    name: user?.name || 'Dr. Sharma',
    email: user?.email || 'admin@medikiosk.in',
    phone: user?.phone || '+91 98765 43210',
    specialization: user?.specialization || 'Consultant Physician',
  });

  React.useEffect(() => {
    const userEmail = user?.email || 'admin@medikiosk.in';
    fetch(`/api/auth/me?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setForm({
            name: json.data.name,
            email: json.data.email,
            phone: json.data.phone || '+91 98765 43210',
            specialization: json.data.specialization || 'Consultant Physician',
          });
        }
      })
      .catch(() => {
        if (user) {
          setForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '+91 98765 43210',
            specialization: user.specialization || 'Consultant Physician',
          });
        }
      });
  }, [user]);

  const handleSave = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      updateUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
      });

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Profile updated in SQLite successfully', {
          description: 'New credentials persisted in database and synced across workstation.',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save profile changes');
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Profile Information</h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Manage your personal information and credentials</p>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <PatientAvatar
          name={form.name}
          size="xl"
          className="ring-2 ring-blue-100 dark:ring-blue-900/50 shadow-xs"
        />
        <div>
          <p className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">{form.name}</p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{form.specialization}</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
            Full Name {!editing && <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">(Click Edit to change)</span>}
          </label>
          <input
            type="text"
            disabled={!editing}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Email</label>
          <input
            type="email"
            disabled={!editing}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Phone</label>
          <input
            type="tel"
            disabled={!editing}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Specialization</label>
          <input
            type="text"
            disabled={!editing}
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        {editing ? (
          <>
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
