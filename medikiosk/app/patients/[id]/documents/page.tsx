'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { usePatientStore } from '@/store/patientStore';
import { PatientHeader } from '@/components/patients/PatientHeader';
import { PatientTabs } from '@/components/patients/PatientTabs';
import { DocumentsPanel } from '@/components/patient/DocumentsPanel';

export default function PatientDocumentsPage() {
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;
  const { selectPatient, getSelectedPatient, patients, setActiveTab, fetchPatients } = usePatientStore();

  React.useEffect(() => {
    fetchPatients();
    if (patientId) {
      selectPatient(patientId);
    }
    setActiveTab('documents');
  }, [patientId, selectPatient, setActiveTab, fetchPatients]);

  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();
  if (!patient) return null;

  return (
    <main className="min-h-screen clinical-mesh p-2.5 sm:p-4 md:p-5 text-[#0F172A] dark:text-[#F1F5F9] flex flex-col justify-center">
      <div className="mx-auto w-full max-w-[1360px] flex-1 flex flex-col">
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] card-elevated overflow-hidden flex flex-col flex-1 min-h-[calc(100vh-2.5rem)]">
          <PatientHeader />
          <PatientTabs activeTab="documents" patientId={patient.id} />
          <div className="flex-1 overflow-y-auto">
            <DocumentsPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
