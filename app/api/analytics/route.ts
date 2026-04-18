import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';

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
