'use client';

import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Calendar } from 'lucide-react';
import { useLang } from '@/lib/i18n/context';

export default function AccountPage() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <>
      <DashboardHeader title={t.account_title} description={t.account_desc} />

      <div className="max-w-lg space-y-4">
        <Card>
          <CardTitle className="mb-5">{t.account_profile}</CardTitle>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <User size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-white/30">{t.account_name}</p>
                <p className="text-sm text-white font-medium">{user?.displayName || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Mail size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-white/30">{t.account_email}</p>
                <p className="text-sm text-white font-medium">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Calendar size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-white/30">{t.account_member_since}</p>
                <p className="text-sm text-white font-medium">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
export const dynamic = 'force-dynamic';
