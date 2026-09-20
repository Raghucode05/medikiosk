import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { buildSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email. Please sign up first.' },
        { status: 401 }
      );
    }

    if (user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicName: user.clinicName,
        room: user.room,
        specialization: user.specialization,
        phone: user.phone,
      },
    });

    // Set session cookie
    response.headers.set('Set-Cookie', buildSessionCookie(user.id, user.email));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
