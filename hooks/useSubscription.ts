'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Subscription } from '@/types/user';

export function useSubscription(uid: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      const data = snap.data();
      setSubscription(data?.subscription ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isTrial = subscription?.status === 'trialing';
  const isExpired = subscription?.status === 'canceled' || subscription?.status === 'past_due';

  return { subscription, loading, isActive, isTrial, isExpired };
}
