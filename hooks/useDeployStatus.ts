'use client';

import { useState, useEffect, useRef } from 'react';
import { subscribeToSite } from '@/lib/firebase/firestore';
import type { Site, DeploymentStatus } from '@/types/site';

export function useDeployStatus(siteId: string | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const isDone = status === 'ready' || status === 'error' || status === 'disabled';

  useEffect(() => {
    if (!siteId) return;

    const unsubscribe = subscribeToSite(siteId, (updatedSite) => {
      setSite(updatedSite);
      setStatus(updatedSite?.deployment?.status ?? 'idle');
    });

    return unsubscribe;
  }, [siteId]);

  return { site, status, isDone };
}
