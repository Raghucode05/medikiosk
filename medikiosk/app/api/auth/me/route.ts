import { NextResponse } from 'next/server';
import { getUserByEmail, updateUser, getDb } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const doctorId = getSessionDoctorId(request);
    const db = getDb();

    let user: any = null;
    if (doctorId) {
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(doctorId);
    }

    if (!user) {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get('email');
      if (email) {
        user = getUserByEmail(email);
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found or unauthenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicName: user.clinic_name || user.clinicName,
        room: user.room,
        specialization: user.specialization,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const doctorId = getSessionDoctorId(request);
    const body = await request.json();
    const email = body.email || (doctorId ? (getDb().prepare('SELECT email FROM users WHERE id = ?').get(doctorId) as any)?.email : null);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email required or not authenticated' },
        { status: 401 }
      );
    }

    const updated = updateUser(email, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update user profile in SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Database update failed' },
      { status: 500 }
    );
  }
}
