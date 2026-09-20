import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionDoctorId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const requestedTable = searchParams.get('table');
    const doctorId = getSessionDoctorId(request);

    // Get list of all tables
    const tablesResult = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all() as { name: string }[];

    const showAll = searchParams.get('all') === '1' || searchParams.get('all') === 'true';

    const tablesSummary = tablesResult.map(({ name }) => {
      const columns = db.prepare(`PRAGMA table_info("${name}")`).all() as {
        cid: number;
        name: string;
        type: string;
        notnull: number;
        pk: number;
      }[];

      const hasDoctorId = columns.some((c) => c.name === 'doctor_id');
      let count = 0;
      if (hasDoctorId && doctorId && !showAll) {
        count = (db.prepare(`SELECT COUNT(*) as count FROM "${name}" WHERE doctor_id = ?`).get(doctorId) as any).count;
      } else {
        count = (db.prepare(`SELECT COUNT(*) as count FROM "${name}"`).get() as any).count;
      }

      return {
        name,
        count,
        columns: columns.map((c) => ({
          name: c.name,
          type: c.type,
          isPk: Boolean(c.pk),
          notNull: Boolean(c.notnull),
        })),
      };
    });

    // If a specific table is requested, return its rows
    const activeTable = requestedTable || (tablesSummary[0]?.name ?? 'patients');
    const tableInfo = tablesSummary.find((t) => t.name === activeTable);

    let rows: any[] = [];
    if (tableInfo) {
      const hasDoctorId = tableInfo.columns.some((c) => c.name === 'doctor_id');
      if (hasDoctorId && doctorId && !showAll) {
        rows = db.prepare(`SELECT * FROM "${activeTable}" WHERE doctor_id = ? ORDER BY rowid DESC LIMIT 200`).all(doctorId);
      } else {
        rows = db.prepare(`SELECT * FROM "${activeTable}" ORDER BY rowid DESC LIMIT 200`).all();
      }
    }

    return NextResponse.json({
      success: true,
      dbPath: 'data/medikiosk.db',
      activeTable,
      tables: tablesSummary,
      rows,
      totalRows: tableInfo ? tableInfo.count : 0,
    });
  } catch (error: any) {
    console.error('Failed to inspect database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to inspect database', error: error?.message },
      { status: 500 }
    );
  }
}
