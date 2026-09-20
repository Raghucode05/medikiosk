import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { buildSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password, clinicName, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this official email already exists.' },
        { status: 409 }
      );
    }

    const newUser = createUser({
      name,
      email,
      password,
      role: role || 'Clinical Administrator',
      clinicName: clinicName || 'MediKiosk OPD Clinic',
    });

    const response = NextResponse.json({ success: true, data: newUser }, { status: 201 });

    // Set session cookie for the new user
    response.headers.set('Set-Cookie', buildSessionCookie(newUser.id, newUser.email));

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Account registration failed' },
      { status: 500 }
    );
  }
}
