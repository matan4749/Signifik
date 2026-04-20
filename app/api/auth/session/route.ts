import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase/admin';

const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export async function POST(req: NextRequest) {
  let token: string;
  try {
    const body = await req.json();
    token = body?.token;
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Step 1: verify the ID token — this is the real auth check
  let uid: string;
  let email: string;
  let displayName: string;
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email ?? '';
    displayName = decoded.name ?? '';
  } catch (err) {
    console.error('[session] verifyIdToken failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Step 2: try to create a long-lived session cookie; fall back to raw ID token
  let sessionValue: string;
  try {
    const adminAuth = getAdminAuth();
    sessionValue = await adminAuth.createSessionCookie(token, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });
  } catch (err) {
    // createSessionCookie requires the token to be fresh (issued < 5 min ago).
    // On redirect-flow or slow networks it can fail — fall back to ID token which
    // verifySession() in admin.ts already handles.
    console.warn('[session] createSessionCookie failed, using ID token fallback:', err instanceof Error ? err.message : err);
    sessionValue = token;
  }

  // Step 3: upsert user doc (best-effort, non-fatal)
  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({ uid, email, displayName, createdAt: new Date().toISOString() });
    }
  } catch (err) {
    console.warn('[session] user doc upsert failed:', err instanceof Error ? err.message : err);
  }

  // Step 4: write cookie
  try {
    const cookieStore = await cookies();
    cookieStore.set('session', sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
  } catch (err) {
    console.error('[session] cookie write failed:', err);
    return NextResponse.json({ error: 'Cookie write failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
