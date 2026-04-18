'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/Badge';
import { useLang } from '@/lib/i18n/context';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { isTrial } = useSubscription(user?.uid);
  const { t } = useLang();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-white/40">{description}</p>}
      </div>
      {isTrial && (
        <Link href="/account/billing">
          <Badge variant="warning" dot className="cursor-pointer hover:opacity-80 transition-opacity">
            {t.trial_active_badge}
          </Badge>
        </Link>
      )}
    </div>
  );
}
