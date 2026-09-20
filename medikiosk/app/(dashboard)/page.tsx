'use client';

import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { PatientQueue } from '@/components/patients/PatientQueue';

export default function PatientsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3">
        <Header />
      </div>
      <div className="flex-1 min-h-0">
        <PatientQueue />
      </div>
    </div>
  );
}
