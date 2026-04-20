import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/firebase/admin';
import { sendWelcomeEmail } from '@/lib/sendgrid/notifications';

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

export async function POST(req: NextRequest) {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { type, name, email } = body;

    if (typeof type !== 'string' || typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (type === 'welcome' && email && name) {
      await sendWelcomeEmail(email, name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
