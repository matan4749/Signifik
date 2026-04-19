import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, getAdminFirestore } from '@/lib/firebase/admin';
import type { UpdateSitePayload } from '@/types/site';

async function getAuthorizedUid(siteId: string): Promise<{ uid: string; error?: never } | { uid?: never; error: NextResponse }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const decoded = await verifySession(sessionCookie);
  const uid = decoded.uid;

  const db = getAdminFirestore();
  const site = await db.collection('sites').doc(siteId).get();
  if (!site.exists || site.data()?.ownerId !== uid) {
    return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) };
  }

  return { uid };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const { siteId } = await params;
    const result = await getAuthorizedUid(siteId);
    if (result.error) return result.error;

    const db = getAdminFirestore();
    const site = await db.collection('sites').doc(siteId).get();
    return NextResponse.json(site.data());
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const { siteId } = await params;
    const result = await getAuthorizedUid(siteId);
    if (result.error) return result.error;

    const body = (await req.json()) as UpdateSitePayload;
    const db = getAdminFirestore();

    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.config) {
      Object.entries(body.config).forEach(([k, v]) => {
        update[`config.${k}`] = v;
      });
    }
    if (body.customDomain !== undefined) update.customDomain = body.customDomain;

    await db.collection('sites').doc(siteId).update(update);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const { siteId } = await params;
    const result = await getAuthorizedUid(siteId);
    if (result.error) return result.error;

    const db = getAdminFirestore();
    await db.collection('sites').doc(siteId).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
