'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DayStats {
  date: string;
  views: number;
  clicks: number;
  cvr: number;
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

  const fetchAnalytics = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/analytics?siteId=${siteId}&days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary ?? null);
      } else {
        setSummary(null);
      }
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [siteId, days]);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { summary, loading };
}
