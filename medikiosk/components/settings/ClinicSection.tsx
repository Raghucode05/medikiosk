'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const STORAGE_KEY = 'medikiosk_clinic_info';

export function ClinicSection() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [editing, setEditing] = React.useState(true);
  const [form, setForm] = React.useState({
    name: user?.clinicName || 'MediKiosk OPD Clinic',
    address: '123 Medical Avenue',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
  });

  React.useEffect(() => {
    // First load from SQLite API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setForm({
            name: json.data.name || 'MediKiosk OPD Clinic',
            address: json.data.address || '123 Medical Avenue',
            city: json.data.city || 'Ahmedabad',
            state: json.data.state || 'Gujarat',
            pincode: json.data.pincode || '380001',
          });
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setForm(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      });
  }, []);

  const handleSave = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      updateUser({ clinicName: form.name });

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Clinic information updated in SQLite successfully', {
          description: 'Facility details persisted in database and synchronized across consultation suite.',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save clinic information');
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">Clinic Information</h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Manage your clinic details and contact information</p>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Info
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
            Clinic Name {!editing && <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">(Click Edit to change)</span>}
          </label>
          <input
            type="text"
            disabled={!editing}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Address</label>
          <input
            type="text"
            disabled={!editing}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">City</label>
          <input
            type="text"
            disabled={!editing}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">State</label>
          <input
            type="text"
            disabled={!editing}
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Pincode</label>
          <input
            type="text"
            disabled={!editing}
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#0F172A] dark:text-[#F1F5F9] disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-[#64748B] dark:disabled:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#1E3A8A] dark:focus:ring-[#3B82F6] transition-all"
          />
        </div>
      </div>

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
            Edit Clinic Info
          </Button>
        )}
      </div>
    </div>
  );
}
