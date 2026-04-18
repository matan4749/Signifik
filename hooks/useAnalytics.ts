'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export interface DayStats {
  date: string;
  views: number;
  clicks: number;
  cvr: number; // clicks / views * 100
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  cvr: number;
  days: DayStats[];
  trend: 'up' | 'down' | 'neutral';
}

export function useAnalytics(siteId: string | undefined, days = 14): {
  summary: AnalyticsSummary | null;
  loading: boolean;
} {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siteId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'sites', siteId, 'analytics'),
      orderBy('date', 'desc'),
      limit(days)
    );

    const unsub = onSnapshot(q, (snap) => {
      const dayStats: DayStats[] = snap.docs.map((doc) => {
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

      // Trend: compare last 7 days vs prior 7 days
      const recent = dayStats.slice(0, 7).reduce((s, d) => s + d.clicks, 0);
      const prior  = dayStats.slice(7, 14).reduce((s, d) => s + d.clicks, 0);
      const trend: 'up' | 'down' | 'neutral' =
        prior === 0 ? 'neutral' : recent > prior ? 'up' : recent < prior ? 'down' : 'neutral';

      setSummary({ totalViews, totalClicks, cvr, days: [...dayStats].reverse(), trend });
      setLoading(false);
    });

    return unsub;
  }, [siteId, days]);

  return { summary, loading };
}
