'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Subscription } from '@/types/user';

export function useSubscription(uid: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/user', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription ?? null);
      } else {
        setSubscription(null);
      }
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    setLoading(true);
    fetchSubscription();
  }, [fetchSubscription]);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isTrial = subscription?.status === 'trialing';
  const isExpired = subscription?.status === 'canceled' || subscription?.status === 'past_due';

  return { subscription, loading, isActive, isTrial, isExpired };
}
