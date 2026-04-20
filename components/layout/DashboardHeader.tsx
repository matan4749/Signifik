'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/Badge';
import { UserAvatar } from '@/components/layout/UserAvatar';
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
    <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-white/40">{description}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isTrial && (
          <Link href="/account/billing">
            <Badge variant="warning" dot className="cursor-pointer hover:opacity-80 transition-opacity">
              {t.trial_active_badge}
            </Badge>
          </Link>
        )}
        {/* Avatar visible on mobile (sidebar hidden); hidden on md+ where sidebar shows it */}
        <div className="md:hidden">
          <UserAvatar size={34} />
        </div>
      </div>
    </div>
  );
}
