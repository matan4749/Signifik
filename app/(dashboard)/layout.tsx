import type { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { SubscriptionBanner } from '@/components/layout/SubscriptionBanner';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen liquid-bg">
      <DashboardSidebar />
      <main className="ml-60 min-h-screen flex flex-col">
        <SubscriptionBanner />
        <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
