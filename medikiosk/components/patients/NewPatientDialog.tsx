'use client';

import * as React from 'react';
import { UserPlus, Sparkles, ShieldCheck, Check, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/store/patientStore';
import { toast } from 'sonner';

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewPatientDialog({ open, onOpenChange, onSuccess }: NewPatientDialogProps) {
  const addPatient = usePatientStore((state) => state.addPatient);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    token: '',
    appointmentTime: '',
    abhaLinked: true,
    chiefComplaint: '',
    hpiText: '',
    phone: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      token: '',
      appointmentTime: '',
      abhaLinked: true,
      chiefComplaint: '',
      hpiText: '',
      phone: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Patient full name is required');
      return;
    }
    const parsedAge = parseInt(formData.age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      toast.error('Please enter a valid age (1-120)');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addPatient({
        name: formData.name.trim(),
        age: parsedAge,
        gender: formData.gender,
        token: formData.token.trim() || undefined,
        appointmentTime: formData.appointmentTime.trim() || undefined,
        abhaLinked: formData.abhaLinked,
        chiefComplaint: formData.chiefComplaint.trim() || 'General OPD Consultation',
        hpiText: formData.hpiText.trim() || 'Patient arrived for outpatient consultation. Vitals recorded at kiosk.',
        phone: formData.phone.trim() || undefined,
      });

      if (result) {
        toast.success(`Patient registered successfully in SQLite!`, {
          description: `${result.name} assigned Token #${result.token}. Live queue updated.`,
        });
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to create patient record in database');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] rounded-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-[#E2E8F0]/80 dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#1E293B]/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-sky-300 border border-[#DBEAFE] dark:border-[#334155]">
                <UserPlus className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <DialogTitle className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                  Register New OPD Patient
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Enters structured record directly into SQLite database and live queue
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Form Fields Body */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 42"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Token Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                  Token Number (Auto if blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 129"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98XXXXXX99"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>

            {/* ABHA Checkbox */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EFF6FF]/70 dark:bg-[#1E293B]/40 border border-[#DBEAFE] dark:border-[#1E293B]">
              <input
                type="checkbox"
                id="abha-checkbox"
                checked={formData.abhaLinked}
                onChange={(e) => setFormData({ ...formData, abhaLinked: e.target.checked })}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <label htmlFor="abha-checkbox" className="flex items-center gap-1.5 cursor-pointer select-none">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  Link with Ayushman Bharat Health Account (ABHA Verified)
                </span>
              </label>
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Chief Complaint
              </label>
              <input
                type="text"
                placeholder="e.g. Fever, persistent dry cough for 4 days"
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            {/* HPI Notes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                History of Present Illness (HPI) Notes
              </label>
              <textarea
                rows={2}
                placeholder="Patient reports onset of low-grade fever with sore throat. No shortness of breath."
                value={formData.hpiText}
                onChange={(e) => setFormData({ ...formData, hpiText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-xs text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E2E8F0]/80 dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#1E293B]/50 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-[#1E3A8A] hover:bg-[#172554] font-bold gap-1.5 shadow-md shadow-blue-900/20 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving to SQLite...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Save to SQLite &amp; Queue</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
