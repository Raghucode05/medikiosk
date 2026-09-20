import { NextResponse } from 'next/server';
import { updateQueueStatus, getQueueSummary } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';
import { QueueStatus } from '@/types/queue';

export const dynamic = 'force-dynamic';

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
    const status = body.status as QueueStatus;

    if (!status || !['waiting', 'in-consultation', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required (waiting, in-consultation, completed)' },
        { status: 400 }
      );
    }

    const updated = updateQueueStatus(id, status, doctorId);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Queue record not found or unauthorized' },
        { status: 404 }
      );
    }

    const summary = getQueueSummary(doctorId);

    return NextResponse.json({
      success: true,
      data: updated,
      summary,
    });
  } catch (error) {
    console.error('Failed to update queue status in SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update queue status' },
      { status: 500 }
    );
  }
}
