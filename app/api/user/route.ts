import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, getAdminFirestore } from '@/lib/firebase/admin';

async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    const decoded = await verifySession(session);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function GET() {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getAdminFirestore();
    const userDoc = await db.collection('users').doc(uid).get();
    const data = userDoc.data() ?? {};
    return NextResponse.json({ subscription: data.subscription ?? null });
  } catch {
    return NextResponse.json({ subscription: null });
  }
}
