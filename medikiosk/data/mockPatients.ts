import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    token: '124',
    appointmentTime: '10:15 AM',
    abhaLinked: true,
    chiefComplaint: 'Fever with cough for 7 days',
    hpiText: 'Fever (101°F), productive illness, mild breathlessness, no chest pain. No O2 support. No weight history.',
    medicalHistory: [
      { id: 'mh1', title: 'Past Medical History', description: 'Hypertension crisis', icon: 'FlaskConical' },
      { id: 'mh2', title: 'Surgical History', description: 'Polighilsan injury', icon: 'Calendar' },
      { id: 'mh3', title: 'Drug & Allergy', description: 'Allergic to penicillin', icon: 'ShieldAlert' },
      { id: 'mh4', title: 'Family History', description: 'Father - Diabetes, Mother - Hypertension', icon: 'Users' },
    ],
    timeline: [
      { id: 't1', type: 'lab-report', title: 'Lab Report - 22 Mar 2024', date: '12 Mar 2024', description: 'HbA1c - 7.3% (High)' },
      { id: 't2', type: 'prescription', title: 'Prescription - 05 Jan 2024', date: 'Prescription', description: 'Metformin - 30mg - 1-0-1' },
      { id: 't3', type: 'discharge', title: 'Discharge Summary', date: '12 Dec 2022', description: 'Add find for vital time' },
      { id: 't4', type: 'lab-report', title: 'Lab Report - 08 Aug 2022', date: '(Cholesterol...)', description: 'Cholesterol - 242 (high)' },
      { id: 't5', type: 'surgery', title: 'Surgery', date: '15 May 2020', description: 'Add find for vital dispensary' },
    ],
    documents: [
      {
        id: 'd1',
        type: 'lab-report',
        title: 'Lab Report - 12 Mar 2024',
        date: '12 Mar 2024',
        extractedData: [
          { label: 'HbA1c', value: '7.8%' },
          { label: 'Fasting Glucose', value: '156 mg/dL' },
          { label: 'Cholesterol', value: '242 mg/dL' },
        ],
      },
      {
        id: 'd2',
        type: 'prescription',
        title: 'Prescription - 05 Jan 2024',
        date: '05 Jan 2024',
        extractedData: [
          { label: 'Metformin', value: '30mg - 1-0-1' },
          { label: 'Cholesterol', value: '30mg - 1-0-1' },
        ],
      },
    ],
    alerts: [
      { id: 'a1', severity: 'high', message: 'HbA1c is 7.8% (High)' },
      { id: 'a2', severity: 'high', message: 'Cholesterol is 242 mg/dL (High)' },
    ],
  },
  {
    id: 'P002',
    name: 'Savita Devi',
    age: 38,
    gender: 'Female',
    token: '123',
    appointmentTime: '10:30 AM',
    abhaLinked: true,
    chiefComplaint: 'Persistent headache for 3 days',
    hpiText: 'Throbbing headache, predominantly frontal. No nausea or vomiting. No visual disturbances. BP recorded 150/95 mmHg.',
    medicalHistory: [
      { id: 'mh1', title: 'Past Medical History', description: 'Migraine, Hypothyroidism', icon: 'FlaskConical' },
      { id: 'mh2', title: 'Surgical History', description: 'None recorded', icon: 'Calendar' },
      { id: 'mh3', title: 'Drug & Allergy', description: 'No known drug allergies', icon: 'ShieldAlert' },
      { id: 'mh4', title: 'Family History', description: 'Mother - Hypertension', icon: 'Users' },
    ],
    timeline: [
      { id: 't1', type: 'lab-report', title: 'Lab Report - 15 Feb 2024', date: '15 Feb 2024', description: 'TSH - 6.2 mIU/L (High)' },
      { id: 't2', type: 'prescription', title: 'Prescription - 10 Jan 2024', date: 'Prescription', description: 'Thyronorm - 50mcg - 1-0-0' },
    ],
    documents: [
      {
        id: 'd1',
        type: 'lab-report',
        title: 'Lab Report - 15 Feb 2024',
        date: '15 Feb 2024',
        extractedData: [
          { label: 'TSH', value: '6.2 mIU/L' },
          { label: 'T3', value: '0.8 ng/dL' },
          { label: 'T4', value: '5.1 µg/dL' },
        ],
      },
    ],
    alerts: [
      { id: 'a1', severity: 'high', message: 'TSH is 6.2 mIU/L (Elevated)' },
    ],
  },
  {
    id: 'P003',
    name: 'Rohit Singh',
    age: 32,
    gender: 'Male',
    token: '125',
    appointmentTime: '10:55 AM',
    abhaLinked: false,
    chiefComplaint: 'Lower back pain for 2 weeks',
    hpiText: 'Dull aching pain in lumbar region, radiating to left leg. Pain increases upon bending. No numbness.',
    medicalHistory: [
      { id: 'mh1', title: 'Past Medical History', description: 'Lumbar strain (2022)', icon: 'FlaskConical' },
      { id: 'mh2', title: 'Surgical History', description: 'Appendectomy (2018)', icon: 'Calendar' },
      { id: 'mh3', title: 'Drug & Allergy', description: 'Allergic to sulfa drugs', icon: 'ShieldAlert' },
      { id: 'mh4', title: 'Family History', description: 'Father - Arthritis', icon: 'Users' },
    ],
    timeline: [
      { id: 't1', type: 'lab-report', title: 'Lab Report - 01 Mar 2024', date: '01 Mar 2024', description: 'CRP - 12 mg/L (High)' },
    ],
    documents: [
      {
        id: 'd1',
        type: 'lab-report',
        title: 'Lab Report - 01 Mar 2024',
        date: '01 Mar 2024',
        extractedData: [
          { label: 'CRP', value: '12 mg/L' },
          { label: 'ESR', value: '28 mm/hr' },
        ],
      },
    ],
    alerts: [
      { id: 'a1', severity: 'high', message: 'CRP is 12 mg/L (Elevated)' },
    ],
  },
  {
    id: 'P004',
    name: 'Pooja Varma',
    age: 29,
    gender: 'Female',
    token: '126',
    appointmentTime: '11:09 AM',
    abhaLinked: true,
    chiefComplaint: 'Skin rash and itching for 5 days',
    hpiText: 'Erythematous itchy macular rash on forearms and neck. Mild fever 99.2°F. No difficulty in breathing.',
    medicalHistory: [
      { id: 'mh1', title: 'Past Medical History', description: 'Eczema in childhood', icon: 'FlaskConical' },
      { id: 'mh2', title: 'Surgical History', description: 'None', icon: 'Calendar' },
      { id: 'mh3', title: 'Drug & Allergy', description: 'Allergic to shellfish', icon: 'ShieldAlert' },
      { id: 'mh4', title: 'Family History', description: 'Mother - Asthma, Sister - Atopic Dermatitis', icon: 'Users' },
    ],
    timeline: [
      { id: 't1', type: 'prescription', title: 'Prescription - 20 Feb 2024', date: 'Prescription', description: 'Cetirizine - 10mg - 0-0-1' },
    ],
    documents: [],
    alerts: [],
  },
  {
    id: 'P005',
    name: 'Rajesh Patel',
    age: 55,
    gender: 'Male',
    token: '127',
    appointmentTime: '11:00 AM',
    abhaLinked: true,
    chiefComplaint: 'Chest tightness and shortness of breath',
    hpiText: 'Intermittent retrosternal pressure on exertion, relieved by rest. Associated with mild diaphoresis.',
    medicalHistory: [
      { id: 'mh1', title: 'Past Medical History', description: 'Type 2 Diabetes, Dyslipidemia', icon: 'FlaskConical' },
      { id: 'mh2', title: 'Surgical History', description: 'CABG (2019)', icon: 'Calendar' },
      { id: 'mh3', title: 'Drug & Allergy', description: 'No known allergies', icon: 'ShieldAlert' },
      { id: 'mh4', title: 'Family History', description: 'Father - CAD, Mother - Type 2 Diabetes', icon: 'Users' },
    ],
    timeline: [
      { id: 't1', type: 'lab-report', title: 'Lab Report - 10 Mar 2024', date: '10 Mar 2024', description: 'Troponin - Normal' },
      { id: 't2', type: 'prescription', title: 'Prescription - 15 Feb 2024', date: 'Prescription', description: 'Aspirin 75mg, Atorvastatin 20mg' },
      { id: 't3', type: 'surgery', title: 'CABG Surgery', date: '22 Nov 2019', description: 'Triple vessel bypass' },
    ],
    documents: [
      {
        id: 'd1',
        type: 'lab-report',
        title: 'Lab Report - 10 Mar 2024',
        date: '10 Mar 2024',
        extractedData: [
          { label: 'Troponin', value: 'Normal' },
          { label: 'BNP', value: '180 pg/mL' },
          { label: 'ECG', value: 'Sinus rhythm' },
        ],
      },
    ],
    alerts: [
      { id: 'a1', severity: 'high', message: 'BNP is 180 pg/mL (Borderline high)' },
    ],
  },
];
