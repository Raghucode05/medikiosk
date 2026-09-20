'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePatientStore } from '@/store/patientStore';
import { PatientHeader } from '@/components/patients/PatientHeader';
import { PatientTabs } from '@/components/patients/PatientTabs';
import { PatientSummary } from '@/components/patient/PatientSummary';
import { MedicalTimeline } from '@/components/patient/MedicalTimeline';
import { DocumentsPanel } from '@/components/patient/DocumentsPanel';
import { ReviewEditPanel } from '@/components/patient/ReviewEditPanel';

export default function PatientDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const patientId = routeParams?.id;

  const { selectPatient, patients, getSelectedPatient, activeTab, setActiveTab, fetchPatients } = usePatientStore();

  React.useEffect(() => {
    fetchPatients();
    if (patientId) {
      selectPatient(patientId);
    }
    setActiveTab('summary');
  }, [patientId, selectPatient, setActiveTab, fetchPatients]);

  const patient = (patientId ? patients.find((p) => p.id === patientId) : undefined) || getSelectedPatient();
  if (!patient) return null;

  const renderedContent = {
    summary: <PatientSummary />,
    timeline: <MedicalTimeline />,
    documents: <DocumentsPanel />,
    alerts: <ReviewEditPanel />,
  }[activeTab];

  return (
    <main className="h-screen w-screen min-h-screen overflow-hidden text-[#0F172A] dark:text-[#F1F5F9] flex flex-col bg-white dark:bg-[#0F172A]">
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <PatientHeader />

        {/* Clinical Navigation Tabs */}
        <PatientTabs activeTab={activeTab} patientId={patient.id} />

        <div className="flex-1 overflow-y-auto">
          {renderedContent}
        </div>
      </div>
    </main>
  );
}
