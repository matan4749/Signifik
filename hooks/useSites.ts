'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Site } from '@/types/site';

export function useSites(uid: string | undefined) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = useCallback(async () => {
    if (!uid) {
      setSites([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites ?? []);
      } else {
        setSites([]);
      }
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    setLoading(true);
    fetchSites();
  }, [fetchSites]);

  return { sites, loading, refetch: fetchSites };
}
