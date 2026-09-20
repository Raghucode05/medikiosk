export interface MedicalHistoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimelineEvent {
  id: string;
  type: 'lab-report' | 'prescription' | 'discharge' | 'surgery';
  title: string;
  date: string;
  description: string;
  details?: string;
}

export interface ExtractedDataItem {
  label: string;
  value: string;
}

export interface PatientDocument {
  id: string;
  type: 'lab-report' | 'prescription' | 'other';
  title: string;
  date: string;
  extractedData: ExtractedDataItem[];
}

export interface PatientAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  token: string;
  appointmentTime: string;
  abhaLinked: boolean;
  avatarUrl?: string;
  chiefComplaint: string;
  hpiText: string;
  status?: 'waiting' | 'in-consultation' | 'completed';
  medicalHistory: MedicalHistoryItem[];
  timeline: TimelineEvent[];
  documents: PatientDocument[];
  alerts: PatientAlert[];
}

export type MainTab = 'summary' | 'timeline' | 'documents' | 'alerts';
export type DocumentFilter = 'all' | 'lab-reports' | 'prescriptions' | 'others';
export type TimelineTab = 'medical-timeline' | 'documents';
