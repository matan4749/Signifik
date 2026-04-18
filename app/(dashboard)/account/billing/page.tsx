'use client';

import { CreditCard } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useLang } from '@/lib/i18n/context';

export const dynamic = 'force-dynamic';

export default function BillingPage() {
  const { t } = useLang();

  return (
    <>
      <DashboardHeader title={t.billing_title} description={t.billing_desc} />
      <div className="max-w-lg">
        <Card className="flex flex-col items-center text-center py-10 gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <CreditCard size={24} className="text-indigo-400" />
          </div>
          <div>
            <CardTitle className="mb-2">תשלומים — בקרוב</CardTitle>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
              מערכת התשלומים תהיה זמינה בקרוב.<br />בינתיים האתר פעיל לחלוטין ללא תשלום.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
