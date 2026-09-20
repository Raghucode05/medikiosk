import { NextResponse } from 'next/server';
import { getClinicSettings, updateClinicSettings, ClinicSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = getClinicSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Failed to get clinic settings from SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Database error reading settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Partial<ClinicSettings>;
    const updated = updateClinicSettings(body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update clinic settings in SQLite:', error);
    return NextResponse.json(
      { success: false, error: 'Database error saving settings' },
      { status: 500 }
    );
  }
}
