'use client';

import { useState, useEffect } from 'react';
import { subscribeToUserSites } from '@/lib/firebase/firestore';
import type { Site } from '@/types/site';

export function useSites(uid: string | undefined) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setSites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserSites(uid, (updatedSites) => {
      setSites(updatedSites);
      setLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  return { sites, loading };
}
