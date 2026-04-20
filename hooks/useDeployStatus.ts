'use client';

import { useState, useEffect, useRef } from 'react';
import type { Site, DeploymentStatus } from '@/types/site';

const POLL_INTERVAL_MS = 3000; // poll every 3 seconds until done

export function useDeployStatus(siteId: string | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDone = status === 'ready' || status === 'error' || status === 'disabled';

  useEffect(() => {
    if (!siteId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/sites/${siteId}`);
        if (!res.ok) return;
        const data = (await res.json()) as Site;
        setSite(data);
        setStatus(data?.deployment?.status ?? 'idle');
      } catch {
        // network error — keep polling
      }
    };

    // Fetch immediately, then poll
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [siteId]);

  // Stop polling once deployment is done
  useEffect(() => {
    if (isDone && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isDone]);

  return { site, status, isDone };
}
