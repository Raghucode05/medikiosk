import { NextResponse } from 'next/server';
import { getAllPatients, createPatient, CreatePatientInput } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';

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

    const patients = getAllPatients(doctorId);
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Failed to fetch patients from SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients from database' },
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

    const body = (await request.json()) as CreatePatientInput;

    if (!body.name || !body.age || !body.gender) {
      return NextResponse.json(
        { success: false, error: 'Name, age, and gender are required fields.' },
        { status: 400 }
      );
    }

    const newPatient = createPatient({ ...body, doctorId });
    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
  } catch (error) {
    console.error('Failed to create patient in SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create patient in database' },
      { status: 500 }
    );
  }
}
