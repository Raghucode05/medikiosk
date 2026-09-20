import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Patient, MedicalHistoryItem, TimelineEvent, PatientDocument, PatientAlert } from '@/types/patient';
import { QueuePatient, QueueSummary, QueueStatus } from '@/types/queue';
import { mockPatients } from '@/data/mockPatients';
import { mockQueuePatients } from '@/data/mockQueue';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'medikiosk.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
    seedInitialData(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Clinical Administrator',
      clinic_name TEXT,
      room TEXT DEFAULT 'Room 204',
      specialization TEXT DEFAULT 'Consultant Physician',
      phone TEXT DEFAULT '+91 98765 43210',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      doctor_id TEXT REFERENCES users(id),
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      token TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      abha_linked INTEGER NOT NULL DEFAULT 0,
      avatar_url TEXT,
      chief_complaint TEXT NOT NULL DEFAULT '',
      hpi_text TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medical_history (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'FlaskConical',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_documents (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      extracted_data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_alerts (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS queue (
      id TEXT PRIMARY KEY,
      doctor_id TEXT REFERENCES users(id),
      patient_id TEXT REFERENCES patients(id) ON DELETE SET NULL,
      token TEXT NOT NULL,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting',
      phone TEXT,
      abha_id TEXT,
      last_visit TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clinic_settings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      queue_duration TEXT DEFAULT '15',
      auto_move INTEGER DEFAULT 1,
      show_token INTEGER DEFAULT 1,
      play_sound INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_patients_token ON patients(token);
    CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
    CREATE INDEX IF NOT EXISTS idx_patients_doctor ON patients(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
    CREATE INDEX IF NOT EXISTS idx_queue_doctor ON queue(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_medical_history_patient ON medical_history(patient_id);
    CREATE INDEX IF NOT EXISTS idx_timeline_events_patient ON timeline_events(patient_id);
    CREATE INDEX IF NOT EXISTS idx_documents_patient ON patient_documents(patient_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_patient ON patient_alerts(patient_id);
  `);

  // Migration: add doctor_id column if missing (for existing databases)
  try {
    const cols = db.prepare("PRAGMA table_info(patients)").all() as any[];
    if (!cols.find((c: any) => c.name === 'doctor_id')) {
      db.exec(`ALTER TABLE patients ADD COLUMN doctor_id TEXT REFERENCES users(id)`);
      db.exec(`UPDATE patients SET doctor_id = 'U001' WHERE doctor_id IS NULL`);
    }
  } catch { /* column already exists */ }

  try {
    const cols = db.prepare("PRAGMA table_info(queue)").all() as any[];
    if (!cols.find((c: any) => c.name === 'doctor_id')) {
      db.exec(`ALTER TABLE queue ADD COLUMN doctor_id TEXT REFERENCES users(id)`);
      db.exec(`UPDATE queue SET doctor_id = 'U001' WHERE doctor_id IS NULL`);
    }
  } catch { /* column already exists */ }
}

function seedInitialData(db: Database.Database) {
  const now = new Date().toISOString();

  // Seed users
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, role, clinic_name, room, specialization, phone, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Doctor A
    insertUser.run(
      'U001', 'Dr. Sharma', 'admin@medikiosk.in', 'admin123',
      'Clinical Administrator', 'MediKiosk OPD Clinic', 'Room 204',
      'Consultant Physician', '+91 98765 43210', now, now
    );

    // Doctor B
    insertUser.run(
      'U002', 'Dr. Patel', 'doctor2@medikiosk.in', 'admin123',
      'Consultant Doctor', 'MediKiosk OPD Clinic', 'Room 108',
      'General Physician', '+91 99876 54321', now, now
    );
  }

  // Seed patients — assign doctor_id
  const patientCount = (db.prepare('SELECT COUNT(*) as count FROM patients').get() as any).count;
  if (patientCount === 0) {
    const insertPatient = db.prepare(`
      INSERT INTO patients (
        id, doctor_id, name, age, gender, token, appointment_time, abha_linked, avatar_url,
        chief_complaint, hpi_text, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertHistory = db.prepare(`
      INSERT INTO medical_history (id, patient_id, title, description, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTimeline = db.prepare(`
      INSERT INTO timeline_events (id, patient_id, type, title, date, description, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDoc = db.prepare(`
      INSERT INTO patient_documents (id, patient_id, type, title, date, extracted_data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAlert = db.prepare(`
      INSERT INTO patient_alerts (id, patient_id, severity, message, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Doctor A's patients: P001, P002, P003 (first 3 mock patients)
    // Doctor B's patients: P004, P005 (last 2 mock patients)
    const doctorAssignment: Record<string, string> = {
      'P001': 'U001', // Ramesh Kumar → Dr. Sharma
      'P002': 'U001', // Savita Devi → Dr. Sharma
      'P003': 'U001', // Rohit Singh → Dr. Sharma
      'P004': 'U002', // Pooja Varma → Dr. Patel
      'P005': 'U002', // Rajesh Patel → Dr. Patel
    };

    const seedTx = db.transaction(() => {
      for (const p of mockPatients) {
        const doctorId = doctorAssignment[p.id] || 'U001';
        insertPatient.run(
          p.id,
          doctorId,
          p.name,
          p.age,
          p.gender,
          p.token,
          p.appointmentTime,
          p.abhaLinked ? 1 : 0,
          p.avatarUrl || null,
          p.chiefComplaint,
          p.hpiText,
          now,
          now
        );

        p.medicalHistory.forEach((h, idx) => {
          const histId = `${p.id}_${h.id || idx}`;
          insertHistory.run(histId, p.id, h.title, h.description, h.icon || 'FlaskConical', idx);
        });

        p.timeline.forEach((t, idx) => {
          const timeId = `${p.id}_${t.id || idx}`;
          insertTimeline.run(timeId, p.id, t.type, t.title, t.date, t.description, t.details || null, now);
        });

        p.documents.forEach((d, idx) => {
          const docId = `${p.id}_${d.id || idx}`;
          insertDoc.run(
            docId,
            p.id,
            d.type,
            d.title,
            d.date,
            JSON.stringify(d.extractedData || []),
            now
          );
        });

        p.alerts.forEach((a, idx) => {
          const alertId = `${p.id}_${a.id || idx}`;
          insertAlert.run(alertId, p.id, a.severity, a.message, now);
        });
      }
    });

    seedTx();
  }

  // Seed queue — assign doctor_id
  const queueCount = (db.prepare('SELECT COUNT(*) as count FROM queue').get() as any).count;
  if (queueCount === 0) {
    const insertQueue = db.prepare(`
      INSERT INTO queue (
        id, doctor_id, patient_id, token, name, gender, time, type, status, phone, abha_id, last_visit, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Map queue entries to doctors based on patient assignment
    const queueDoctorMap: Record<string, string> = {
      'Q001': 'U001', // Aarav Mehta (no patient record, assigned to Dr. Sharma)
      'Q002': 'U001', // Neha Patel (no patient record, assigned to Dr. Sharma)
      'Q003': 'U001', // Savita Devi → Dr. Sharma
      'Q004': 'U001', // Ramesh Kumar → Dr. Sharma
      'Q005': 'U001', // Rohit Singh → Dr. Sharma
      'Q006': 'U002', // Pooja Varma → Dr. Patel
      'Q007': 'U002', // Rajesh Patel → Dr. Patel
      'Q008': 'U002', // Anita Sharma → Dr. Patel
    };

    const seedQueueTx = db.transaction(() => {
      for (const q of mockQueuePatients) {
        const matched = mockPatients.find((p) => p.name.toLowerCase() === q.name.toLowerCase() || p.token === q.token);
        const doctorId = queueDoctorMap[q.id] || 'U001';
        insertQueue.run(
          q.id,
          doctorId,
          matched?.id || null,
          q.token,
          q.name,
          q.gender,
          q.time,
          q.type,
          q.status,
          q.phone || '+91 98XXXXXX21',
          q.abhaId || '91-XXXX-XXXX-1234',
          q.lastVisit || '18 Sep 2026',
          now,
          now
        );
      }
    });

    seedQueueTx();
  }

  // Seed clinic settings
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM clinic_settings').get() as any).count;
  if (settingsCount === 0) {
    db.prepare(`
      INSERT INTO clinic_settings (
        id, name, address, city, state, pincode, queue_duration, auto_move, show_token, play_sound, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'default', 'MediKiosk OPD Clinic', '123 Medical Avenue', 'Ahmedabad',
      'Gujarat', '380001', '15', 1, 1, 0, now
    );
  }
}

// ----------------------------------------------------
// PATIENT DATA ACCESS (Doctor-Filtered)
// ----------------------------------------------------

function buildPatientFromRow(db: Database.Database, p: any): Patient {
  const medicalHistory = db.prepare(
    'SELECT id, title, description, icon FROM medical_history WHERE patient_id = ? ORDER BY sort_order ASC'
  ).all(p.id) as MedicalHistoryItem[];

  const timeline = db.prepare(
    'SELECT id, type, title, date, description, details FROM timeline_events WHERE patient_id = ?'
  ).all(p.id) as TimelineEvent[];

  const documentsRaw = db.prepare(
    'SELECT id, type, title, date, extracted_data FROM patient_documents WHERE patient_id = ?'
  ).all(p.id) as any[];

  const documents: PatientDocument[] = documentsRaw.map((d) => ({
    id: d.id,
    type: d.type,
    title: d.title,
    date: d.date,
    extractedData: JSON.parse(d.extracted_data || '[]'),
  }));

  const alerts = db.prepare(
    'SELECT id, severity, message FROM patient_alerts WHERE patient_id = ?'
  ).all(p.id) as PatientAlert[];

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    token: p.token,
    appointmentTime: p.appointment_time,
    status: p.status,
    abhaLinked: Boolean(p.abha_linked),
    avatarUrl: p.avatar_url || undefined,
    chiefComplaint: p.chief_complaint,
    hpiText: p.hpi_text,
    medicalHistory,
    timeline,
    documents,
    alerts,
  };
}

export function getAllPatients(doctorId: string): Patient[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.*,
      COALESCE(
        (SELECT q.status FROM queue q WHERE q.patient_id = p.id ORDER BY q.rowid DESC LIMIT 1),
        'waiting'
      ) as status
    FROM patients p
    WHERE p.doctor_id = ?
    ORDER BY CAST(p.token AS INTEGER) ASC
  `).all(doctorId) as any[];

  return rows.map((p) => buildPatientFromRow(db, p));
}

export function getPatientById(id: string, doctorId?: string): Patient | undefined {
  const db = getDb();

  let query = `
    SELECT p.*,
      COALESCE(
        (SELECT q.status FROM queue q WHERE q.patient_id = p.id ORDER BY q.rowid DESC LIMIT 1),
        'waiting'
      ) as status
    FROM patients p
    WHERE p.id = ?
  `;

  let p: any;
  if (doctorId) {
    query += ` AND p.doctor_id = ?`;
    p = db.prepare(query).get(id, doctorId) as any;
  } else {
    p = db.prepare(query).get(id) as any;
  }

  if (!p) return undefined;
  return buildPatientFromRow(db, p);
}

export function updatePatientSummary(id: string, chiefComplaint: string, hpiText: string, doctorId?: string): Patient | undefined {
  const db = getDb();
  const now = new Date().toISOString();

  if (doctorId) {
    const result = db.prepare(`
      UPDATE patients
      SET chief_complaint = ?, hpi_text = ?, updated_at = ?
      WHERE id = ? AND doctor_id = ?
    `).run(chiefComplaint, hpiText, now, id, doctorId);
    if (result.changes === 0) return undefined;
  } else {
    db.prepare(`
      UPDATE patients
      SET chief_complaint = ?, hpi_text = ?, updated_at = ?
      WHERE id = ?
    `).run(chiefComplaint, hpiText, now, id);
  }

  return getPatientById(id, doctorId);
}

export interface CreatePatientInput {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  token?: string;
  appointmentTime?: string;
  abhaLinked?: boolean;
  chiefComplaint?: string;
  hpiText?: string;
  phone?: string;
  abhaId?: string;
  type?: string;
  doctorId?: string;
}

export function createPatient(input: CreatePatientInput): Patient {
  const db = getDb();
  const now = new Date().toISOString();
  const doctorId = input.doctorId || 'U001';

  // Generate ID if not provided
  const maxPatient = db.prepare("SELECT id FROM patients WHERE id LIKE 'P%' ORDER BY CAST(SUBSTR(id, 2) AS INTEGER) DESC LIMIT 1").get() as any;
  let nextNum = 1;
  if (maxPatient && maxPatient.id) {
    const num = parseInt(maxPatient.id.substring(1), 10);
    if (!isNaN(num)) nextNum = num + 1;
  }
  const id = `P${String(nextNum).padStart(3, '0')}`;

  // Generate token if not provided
  let token = input.token;
  if (!token) {
    const maxToken = db.prepare("SELECT token FROM patients ORDER BY CAST(token AS INTEGER) DESC LIMIT 1").get() as any;
    let nextTokenNum = 120;
    if (maxToken && maxToken.token) {
      const tNum = parseInt(maxToken.token, 10);
      if (!isNaN(tNum)) nextTokenNum = tNum + 1;
    }
    token = String(nextTokenNum);
  }

  const appointmentTime = input.appointmentTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const chiefComplaint = input.chiefComplaint || 'General OPD consultation';
  const hpiText = input.hpiText || 'Patient presented for routine outpatient evaluation. Vitals recorded at triage pod.';
  const abhaLinked = Boolean(input.abhaLinked);

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO patients (
        id, doctor_id, name, age, gender, token, appointment_time, abha_linked, avatar_url,
        chief_complaint, hpi_text, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      doctorId,
      input.name,
      input.age,
      input.gender,
      token,
      appointmentTime,
      abhaLinked ? 1 : 0,
      null,
      chiefComplaint,
      hpiText,
      now,
      now
    );

    // Initial medical history
    db.prepare(`
      INSERT INTO medical_history (id, patient_id, title, description, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`mh_${id}_1`, id, 'Triage Initial Intake', 'New consultation intake recorded at workstation', 'Activity', 0);

    // Initial queue record
    const maxQueue = db.prepare("SELECT id FROM queue WHERE id LIKE 'Q%' ORDER BY CAST(SUBSTR(id, 2) AS INTEGER) DESC LIMIT 1").get() as any;
    let nextQNum = 1;
    if (maxQueue && maxQueue.id) {
      const qNum = parseInt(maxQueue.id.substring(1), 10);
      if (!isNaN(qNum)) nextQNum = qNum + 1;
    }
    const queueId = `Q${String(nextQNum).padStart(3, '0')}`;

    db.prepare(`
      INSERT INTO queue (
        id, doctor_id, patient_id, token, name, gender, time, type, status, phone, abha_id, last_visit, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      queueId,
      doctorId,
      id,
      token,
      input.name,
      input.gender,
      appointmentTime,
      input.type || 'General Consultation',
      'waiting',
      input.phone || '+91 98XXXXXX00',
      input.abhaId || (abhaLinked ? `91-${token}XX-XXXX-${id}` : undefined),
      'Today',
      now,
      now
    );
  });

  tx();
  return getPatientById(id, doctorId)!;
}

export function deletePatient(id: string, doctorId?: string): boolean {
  const db = getDb();
  let res;
  if (doctorId) {
    res = db.prepare('DELETE FROM patients WHERE id = ? AND doctor_id = ?').run(id, doctorId);
  } else {
    res = db.prepare('DELETE FROM patients WHERE id = ?').run(id);
  }
  return res.changes > 0;
}

// ----------------------------------------------------
// QUEUE DATA ACCESS (Doctor-Filtered)
// ----------------------------------------------------

export function getQueue(doctorId: string): QueuePatient[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      id, token, name, gender, time, type, status, phone, abha_id as abhaId, last_visit as lastVisit
    FROM queue
    WHERE doctor_id = ?
    ORDER BY
      CASE status
        WHEN 'waiting' THEN 1
        WHEN 'in-consultation' THEN 2
        WHEN 'completed' THEN 3
        ELSE 4
      END ASC,
      CAST(token AS INTEGER) ASC
  `).all(doctorId) as QueuePatient[];

  return rows;
}

export function getQueueSummary(doctorId: string): QueueSummary {
  const db = getDb();
  const waiting = (db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'waiting' AND doctor_id = ?").get(doctorId) as any).count;
  const inConsultation = (db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'in-consultation' AND doctor_id = ?").get(doctorId) as any).count;
  const completed = (db.prepare("SELECT COUNT(*) as count FROM queue WHERE status = 'completed' AND doctor_id = ?").get(doctorId) as any).count;
  const total = (db.prepare("SELECT COUNT(*) as count FROM queue WHERE doctor_id = ?").get(doctorId) as any).count;

  return {
    waiting,
    inConsultation,
    completed,
    total,
  };
}

export function updateQueueStatus(id: string, status: QueueStatus, doctorId?: string): QueuePatient | undefined {
  const db = getDb();
  const now = new Date().toISOString();

  if (doctorId) {
    db.prepare(`
      UPDATE queue
      SET status = ?, updated_at = ?
      WHERE (id = ? OR token = ?) AND doctor_id = ?
    `).run(status, now, id, id, doctorId);
  } else {
    db.prepare(`
      UPDATE queue
      SET status = ?, updated_at = ?
      WHERE id = ? OR token = ?
    `).run(status, now, id, id);
  }

  let row: QueuePatient | undefined;
  if (doctorId) {
    row = db.prepare(`
      SELECT id, token, name, gender, time, type, status, phone, abha_id as abhaId, last_visit as lastVisit
      FROM queue
      WHERE (id = ? OR token = ?) AND doctor_id = ?
    `).get(id, id, doctorId) as QueuePatient | undefined;
  } else {
    row = db.prepare(`
      SELECT id, token, name, gender, time, type, status, phone, abha_id as abhaId, last_visit as lastVisit
      FROM queue
      WHERE id = ? OR token = ?
    `).get(id, id) as QueuePatient | undefined;
  }

  return row;
}

// ----------------------------------------------------
// CLINIC SETTINGS
// ----------------------------------------------------

export interface ClinicSettings {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  duration: string;
  autoMove: boolean;
  showToken: boolean;
  playSound: boolean;
}

export function getClinicSettings(): ClinicSettings {
  const db = getDb();
  const s = db.prepare('SELECT * FROM clinic_settings WHERE id = ?').get('default') as any;
  if (!s) {
    return {
      name: 'MediKiosk OPD Clinic',
      address: '123 Medical Avenue',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      duration: '15',
      autoMove: true,
      showToken: true,
      playSound: false,
    };
  }

  return {
    name: s.name,
    address: s.address || '',
    city: s.city || '',
    state: s.state || '',
    pincode: s.pincode || '',
    duration: s.queue_duration || '15',
    autoMove: Boolean(s.auto_move),
    showToken: Boolean(s.show_token),
    playSound: Boolean(s.play_sound),
  };
}

export function updateClinicSettings(data: Partial<ClinicSettings>): ClinicSettings {
  const db = getDb();
  const current = getClinicSettings();
  const merged = { ...current, ...data };
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO clinic_settings (
      id, name, address, city, state, pincode, queue_duration, auto_move, show_token, play_sound, updated_at
    ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      address = excluded.address,
      city = excluded.city,
      state = excluded.state,
      pincode = excluded.pincode,
      queue_duration = excluded.queue_duration,
      auto_move = excluded.auto_move,
      show_token = excluded.show_token,
      play_sound = excluded.play_sound,
      updated_at = excluded.updated_at
  `).run(
    merged.name,
    merged.address,
    merged.city,
    merged.state,
    merged.pincode,
    merged.duration,
    merged.autoMove ? 1 : 0,
    merged.showToken ? 1 : 0,
    merged.playSound ? 1 : 0,
    now
  );

  return merged;
}

// ----------------------------------------------------
// USERS & AUTH
// ----------------------------------------------------

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: 'Clinical Administrator' | 'Consultant Doctor';
  clinicName: string;
  room: string;
  specialization: string;
  phone: string;
}

export function getUserByEmail(email: string): (DbUser & { passwordHash: string }) | undefined {
  const db = getDb();
  const u = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as any;
  if (!u) return undefined;

  return {
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: u.password_hash,
    role: u.role,
    clinicName: u.clinic_name || 'MediKiosk OPD Clinic',
    room: u.room || 'Room 204',
    specialization: u.specialization || 'Consultant Physician',
    phone: u.phone || '+91 98765 43210',
  };
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'Clinical Administrator' | 'Consultant Doctor';
  clinicName?: string;
}): DbUser {
  const db = getDb();
  const now = new Date().toISOString();
  const id = `U_${Date.now()}`;
  const role = data.role || 'Clinical Administrator';
  const clinicName = data.clinicName || 'MediKiosk OPD Clinic';

  db.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, role, clinic_name, room, specialization, phone, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.email.toLowerCase().trim(),
    data.password,
    role,
    clinicName,
    'Room 204',
    role === 'Consultant Doctor' ? 'Consultant Physician' : 'Clinical Administrator',
    '+91 98765 43210',
    now,
    now
  );

  return {
    id,
    name: data.name,
    email: data.email,
    role,
    clinicName,
    room: 'Room 204',
    specialization: role === 'Consultant Doctor' ? 'Consultant Physician' : 'Clinical Administrator',
    phone: '+91 98765 43210',
  };
}

export function updateUser(email: string, data: Partial<DbUser>): DbUser | undefined {
  const db = getDb();
  const existing = getUserByEmail(email);
  if (!existing) return undefined;

  const updatedName = data.name || existing.name;
  const updatedRole = data.role || existing.role;
  const updatedClinic = data.clinicName || existing.clinicName;
  const updatedRoom = data.room || existing.room;
  const updatedSpec = data.specialization || existing.specialization;
  const updatedPhone = data.phone || existing.phone;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE users
    SET name = ?, role = ?, clinic_name = ?, room = ?, specialization = ?, phone = ?, updated_at = ?
    WHERE LOWER(email) = LOWER(?)
  `).run(
    updatedName,
    updatedRole,
    updatedClinic,
    updatedRoom,
    updatedSpec,
    updatedPhone,
    now,
    email.trim()
  );

  return {
    id: existing.id,
    name: updatedName,
    email: existing.email,
    role: updatedRole,
    clinicName: updatedClinic,
    room: updatedRoom,
    specialization: updatedSpec,
    phone: updatedPhone,
  };
}
