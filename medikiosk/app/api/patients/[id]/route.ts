import { NextResponse } from 'next/server';
import { getPatientById, updatePatientSummary, deletePatient } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctorId = getSessionDoctorId(request);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const patient = getPatientById(id, doctorId);

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error('Failed to get patient:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctorId = getSessionDoctorId(request);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const chiefComplaint = body.chiefComplaint ?? '';
    const hpiText = body.hpiText ?? '';

    const updated = updatePatientSummary(id, chiefComplaint, hpiText, doctorId);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Patient not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update patient summary in SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Database update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctorId = getSessionDoctorId(request);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deletePatient(id, doctorId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Patient not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Failed to delete patient:', error);
    return NextResponse.json(
      { success: false, error: 'Database delete failed' },
      { status: 500 }
    );
  }
}
