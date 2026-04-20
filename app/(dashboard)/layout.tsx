import type { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SubscriptionBanner } from '@/components/layout/SubscriptionBanner';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen liquid-bg">
      <DashboardSidebar />
      <main className="max-md:ml-0 md:ml-60 min-h-screen flex flex-col">
        <SubscriptionBanner />
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 max-md:pb-24">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
