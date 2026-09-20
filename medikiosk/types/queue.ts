export type QueueStatus = 'waiting' | 'in-consultation' | 'completed';

export interface QueuePatient {
  id: string;
  token: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  time: string;
  type: string;
  status: QueueStatus;
  phone?: string;
  abhaId?: string;
  lastVisit?: string;
}

export interface QueueSummary {
  waiting: number;
  inConsultation: number;
  completed: number;
  total: number;
}
