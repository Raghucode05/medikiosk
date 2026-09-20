'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Send, Pencil } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function ReviewEditPanel() {
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const {
    patients,
    getSelectedPatient,
    saveDraft,
    toggleSummaryEditing,
  } = usePatientStore();

  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  if (!patient) return null;

  const handleSaveDraft = () => {
    saveDraft();
    toast.success('Draft saved successfully', {
      description: `Record for ${patient.name} preserved as local draft.`,
    });
  };

  const handleConfirmShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      setShareModalOpen(false);
      toast.success('Clinical summary shared successfully.', {
        description: `Summary pushed to HIS & ABHA registry for ${patient.name}.`,
      });
    }, 600);
  };

  const checklistItems = [
    { label: 'History', status: 'Complete' },
    { label: 'Documents', status: `${patient.documents.length} uploaded` },
    { label: 'AI Analysis', status: 'Complete' },
    { label: 'ABHA Linked', status: patient.abhaLinked ? 'Yes' : 'Pending' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs overflow-hidden">
      <div className="p-3.5 border-b border-[#E2E8F0]/70 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/patients/${patient.id}`}
            aria-label="Back to patient summary"
            className="cursor-pointer hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#0F172A] dark:text-[#F8FAFC] stroke-[2.5]" />
          </Link>
          <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Review & Edit</h3>
        </div>
        <button
          onClick={handleSaveDraft}
          className="text-sm font-semibold text-[#1E3A8A] dark:text-sky-400 hover:text-[#172554] transition-colors cursor-pointer"
        >
          Save as Draft
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-emerald-600">
            <CheckCircle2 className="h-4 w-4 fill-emerald-100 text-emerald-600 shrink-0" />
            <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Clinical History Summary</span>
          </div>
          <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-2">Clinical History Summary</h4>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Last updated, Today, 10:12 AM</p>
        </div>

        <div className="space-y-2.5 pt-1 pb-1">
          {checklistItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-50 shrink-0" />
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{item.label}</span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">({item.status})</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] p-3.5 space-y-3">
          <div>
            <h5 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Ready to Share</h5>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-snug">
              Push this record to the hospital system and ABHA registry before the patient leaves the hospital.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#172554] active:bg-[#1e40af] text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 fill-white text-white" />
              <span>Share to HIS & ABHA</span>
            </button>

            <button
              onClick={toggleSummaryEditing}
              className="w-full flex items-center justify-center gap-1.5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 text-[#0F172A] dark:text-[#F8FAFC] font-semibold text-sm py-2 px-4 rounded-xl transition-all cursor-pointer"
            >
              <Pencil className="h-3 w-3 text-[#64748B]" />
              <span>Edit Summary</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to HIS & ABHA</DialogTitle>
            <DialogDescription>
              Are you sure you want to share this patient's clinical summary with HIS & ABHA?
              This action will publish the structured consultation record to the hospital network.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShareModalOpen(false)}
              disabled={isSharing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmShare}
              disabled={isSharing}
            >
              {isSharing ? 'Sharing...' : 'Confirm & Share'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
