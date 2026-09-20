import { create } from 'zustand';
import { Patient, MainTab, DocumentFilter, TimelineTab, PatientDocument } from '@/types/patient';

interface CreatePatientPayload {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  token?: string;
  appointmentTime?: string;
  abhaLinked?: boolean;
  chiefComplaint?: string;
  hpiText?: string;
  phone?: string;
}

interface PatientStore {
  patients: Patient[];
  selectedPatientId: string;
  activeTab: MainTab;
  documentFilter: DocumentFilter;
  timelineTab: TimelineTab;
  searchQuery: string;
  summaryEditing: boolean;
  draftSaved: boolean;
  expandedHistoryItems: string[];
  sidebarOpen: boolean;
  isLoading: boolean;

  // Actions
  fetchPatients: () => Promise<void>;
  resetPatients: () => void;
  selectPatient: (id: string) => void;
  setActiveTab: (tab: MainTab) => void;
  setDocumentFilter: (filter: DocumentFilter) => void;
  setTimelineTab: (tab: TimelineTab) => void;
  setSearchQuery: (query: string) => void;

  toggleSummaryEditing: () => void;
  updateSummary: (chiefComplaint: string, hpiText: string) => Promise<void>;
  addPatient: (patientData: CreatePatientPayload) => Promise<Patient | null>;
  saveDraft: () => void;
  toggleHistoryItem: (id: string) => void;
  toggleSidebar: () => void;
  
  // Selectors
  getSelectedPatient: () => Patient | undefined;
  getFilteredPatients: () => Patient[];
  getFilteredDocuments: () => PatientDocument[];
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  selectedPatientId: '',
  activeTab: 'summary',
  documentFilter: 'all',
  timelineTab: 'medical-timeline',
  searchQuery: '',
  summaryEditing: false,
  draftSaved: false,
  expandedHistoryItems: ['mh1'],
  sidebarOpen: false,
  isLoading: false,

  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const patientList: Patient[] = json.data;
          set({
            patients: patientList,
            selectedPatientId: patientList.length > 0
              ? (patientList.some((p) => p.id === get().selectedPatientId) ? get().selectedPatientId : patientList[0].id)
              : '',
          });
        }
      }
    } catch (e) {
      console.error('Failed to load patients from SQLite API:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  resetPatients: () => set({ patients: [], selectedPatientId: '' }),

  selectPatient: (id: string) => {
    if (!id) return;
    set({ selectedPatientId: id, summaryEditing: false });
  },
  setActiveTab: (tab: MainTab) => set({ activeTab: tab }),
  setDocumentFilter: (filter: DocumentFilter) => set({ documentFilter: filter }),
  setTimelineTab: (tab: TimelineTab) => set({ timelineTab: tab }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleSummaryEditing: () => set((state) => ({ summaryEditing: !state.summaryEditing })),
  updateSummary: async (chiefComplaint: string, hpiText: string) => {
    const selectedId = get().selectedPatientId;
    if (!selectedId) return;
    
    // Optimistic local state update
    set((state) => ({
      summaryEditing: false,
      patients: state.patients.map((p) =>
        p.id === selectedId ? { ...p, chiefComplaint, hpiText } : p
      ),
    }));

    try {
      const res = await fetch(`/api/patients/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chiefComplaint, hpiText }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === selectedId ? json.data : p
          ),
        }));
      }
    } catch (e) {
      console.error('Failed to sync summary with SQLite database:', e);
    }
  },

  addPatient: async (patientData: CreatePatientPayload): Promise<Patient | null> => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newPatient: Patient = json.data;
        set((state) => ({
          patients: [newPatient, ...state.patients],
          selectedPatientId: newPatient.id,
        }));
        return newPatient;
      }
    } catch (e) {
      console.error('Failed to create patient in SQLite:', e);
    }
    return null;
  },

  saveDraft: () => {
    set({ draftSaved: true });
    setTimeout(() => {
      set({ draftSaved: false });
    }, 3000);
  },
  toggleHistoryItem: (id: string) =>
    set((state) => ({
      expandedHistoryItems: state.expandedHistoryItems.includes(id)
        ? state.expandedHistoryItems.filter((item) => item !== id)
        : [...state.expandedHistoryItems, id],
    })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  getSelectedPatient: () => {
    const state = get();
    return state.patients.find((p) => p.id === state.selectedPatientId) || state.patients[0];
  },
  getFilteredPatients: () => {
    const state = get();
    const q = state.searchQuery.toLowerCase().trim();
    if (!q) return state.patients;
    return state.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.token.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.abhaLinked && 'abha'.includes(q))
    );
  },
  getFilteredDocuments: () => {
    const state = get();
    const patient = state.getSelectedPatient();
    if (!patient) return [];
    if (state.documentFilter === 'all') return patient.documents;
    if (state.documentFilter === 'lab-reports') {
      return patient.documents.filter((d) => d.type === 'lab-report');
    }
    if (state.documentFilter === 'prescriptions') {
      return patient.documents.filter((d) => d.type === 'prescription');
    }
    if (state.documentFilter === 'others') {
      return patient.documents.filter((d) => d.type === 'other');
    }
    return patient.documents;
  },
}));
