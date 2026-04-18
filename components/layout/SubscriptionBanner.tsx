'use client';

import Link from 'next/link';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLang } from '@/lib/i18n/context';

export function SubscriptionBanner() {
  const { user } = useAuth();
  const { subscription, isTrial, isExpired } = useSubscription(user?.uid);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLang();

  if (dismissed || !subscription) return null;

  // Trial ending in ≤3 days
  const trialEndsSoon = isTrial && subscription.trialEndsAt
    ? (new Date(subscription.trialEndsAt).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000
    : false;

  if (!isExpired && !trialEndsSoon) return null;

  const message = isExpired
    ? t.banner_expired
    : t.banner_trial_ends(new Date(subscription.trialEndsAt!).toLocaleDateString());

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-sm">
      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
      <p className="text-amber-300 flex-1">{message}</p>
      <Link
        href="/account/billing"
        className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 underline transition-colors"
      >
        {t.banner_manage}
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-400/50 hover:text-amber-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
