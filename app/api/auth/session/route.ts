import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase/admin';

const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 days in seconds

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    const adminAuth = getAdminAuth();

    // Verify the ID token first
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Try to create a proper session cookie; fall back to storing the ID token directly
    let sessionValue: string;
    try {
      sessionValue = await adminAuth.createSessionCookie(token, {
        expiresIn: SESSION_MAX_AGE * 1000,
      });
    } catch {
      // If createSessionCookie fails (e.g. Admin SDK misconfiguration),
      // fall back to storing the raw ID token — still validated above
      console.warn('createSessionCookie failed, falling back to ID token');
      sessionValue = token;
    }

    // Upsert user doc in Firestore
    try {
      const db = getAdminFirestore();
      const userRef = db.collection('users').doc(decodedToken.uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        await userRef.set({
          uid: decodedToken.uid,
          email: decodedToken.email ?? '',
          displayName: decodedToken.name ?? '',
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      // Non-fatal — user doc creation failure shouldn't block login
    }

    const cookieStore = await cookies();
    cookieStore.set('session', sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
