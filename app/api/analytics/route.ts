import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('siteId');
  const daysParam = parseInt(searchParams.get('days') ?? '14', 10);

  if (!siteId) return NextResponse.json({ error: 'siteId required' }, { status: 400 });

  try {
    const db = getAdminFirestore();

    // Verify the user owns this site
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists || siteDoc.data()?.ownerId !== uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const snap = await db
      .collection('sites')
      .doc(siteId)
      .collection('analytics')
      .orderBy('date', 'desc')
      .limit(daysParam)
      .get();

    const dayStats = snap.docs.map((doc) => {
      const d = doc.data();
      const views = d.views ?? 0;
      const clicks = d.clicks ?? 0;
      return {
        date: d.date,
        views,
        clicks,
        cvr: views > 0 ? Math.round((clicks / views) * 100 * 10) / 10 : 0,
      };
    });

    const totalViews = dayStats.reduce((s, d) => s + d.views, 0);
    const totalClicks = dayStats.reduce((s, d) => s + d.clicks, 0);
    const cvr = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100 * 10) / 10 : 0;

    const recent = dayStats.slice(0, 7).reduce((s, d) => s + d.clicks, 0);
    const prior  = dayStats.slice(7, 14).reduce((s, d) => s + d.clicks, 0);
    const trend: 'up' | 'down' | 'neutral' =
      prior === 0 ? 'neutral' : recent > prior ? 'up' : recent < prior ? 'down' : 'neutral';

    return NextResponse.json({
      summary: {
        totalViews,
        totalClicks,
        cvr,
        days: [...dayStats].reverse(),
        trend,
      },
    });
  } catch (err) {
    console.error('GET /api/analytics error:', err);
    return NextResponse.json({ summary: null });
  }
}

export interface AnalyticsEvent {
  siteId: string;
  event: 'view' | 'click';
  meta?: Record<string, string | number | undefined>;
  ts: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyticsEvent;
    const { siteId, event, meta, ts } = body;

    if (!siteId || !event) {
      return NextResponse.json({ error: 'siteId and event are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const day = new Date(ts || Date.now()).toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Write event to subcollection: sites/{siteId}/analytics/{day}/events/{auto}
    const dayRef = db
      .collection('sites')
      .doc(siteId)
      .collection('analytics')
      .doc(day);

    // Atomic counters via FieldValue.increment
    const { FieldValue } = await import('firebase-admin/firestore');

    const batch = db.batch();

    // Increment day counter
    batch.set(
      dayRef,
      {
        date: day,
        views: event === 'view' ? FieldValue.increment(1) : FieldValue.increment(0),
        clicks: event === 'click' ? FieldValue.increment(1) : FieldValue.increment(0),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Store individual event (capped — only store clicks, not every view)
    if (event === 'click' && meta) {
      const eventRef = dayRef.collection('events').doc();
      batch.set(eventRef, {
        event,
        label: meta.label || '',
        href: meta.href || '',
        ts: new Date(ts || Date.now()).toISOString(),
      });
    }

    await batch.commit();

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Swallow analytics errors — never block users
    console.error('Analytics error:', error);
    return NextResponse.json({ ok: true });
  }
}
