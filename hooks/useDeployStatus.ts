'use client';

import { useState, useEffect, useRef } from 'react';
import type { Site, DeploymentStatus } from '@/types/site';

const POLL_INTERVAL_MS = 3000;

export function useDeployStatus(siteId: string | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
        const newStatus = data?.deployment?.status ?? 'idle';
        setStatus(newStatus);
        if (newStatus === 'error') {
          setErrorMessage(data?.deployment?.error ?? null);
        }
      } catch {
        // network error — keep polling
      }
    };

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

  return { site, status, isDone, errorMessage };
}
