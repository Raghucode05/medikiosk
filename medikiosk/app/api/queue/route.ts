import { NextResponse } from 'next/server';
import { getQueue, getQueueSummary, getDb } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';
import { QueuePatient } from '@/types/queue';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const doctorId = getSessionDoctorId(request);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const queue = getQueue(doctorId);
    const summary = getQueueSummary(doctorId);

    return NextResponse.json({
      success: true,
      data: {
        patients: queue,
        summary,
      },
    });
  } catch (error) {
    console.error('Failed to fetch queue from SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch queue from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const doctorId = getSessionDoctorId(request);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Partial<QueuePatient>;

    if (!body.name || !body.token) {
      return NextResponse.json(
        { success: false, error: 'Name and token are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const now = new Date().toISOString();
    const id = `Q_${Date.now()}`;

    db.prepare(`
      INSERT INTO queue (
        id, doctor_id, patient_id, token, name, gender, time, type, status, phone, abha_id, last_visit, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      doctorId,
      body.id || null,
      body.token,
      body.name,
      body.gender || 'Other',
      body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      body.type || 'General Consultation',
      body.status || 'waiting',
      body.phone || null,
      body.abhaId || null,
      body.lastVisit || 'Today',
      now,
      now
    );

    return NextResponse.json({
      success: true,
      data: { id, ...body },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to add to queue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add patient to queue in database' },
      { status: 500 }
    );
  }
}
