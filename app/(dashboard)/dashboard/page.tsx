'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { SiteGrid } from '@/components/dashboard/SiteGrid';
import { useAuth } from '@/hooks/useAuth';
import { useSites } from '@/hooks/useSites';
import { MAX_SITES_PER_USER } from '@/lib/utils/constants';
import { useLang } from '@/lib/i18n/context';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user } = useAuth();
  const { sites, loading } = useSites(user?.uid);
  const canCreateMore = sites.length < MAX_SITES_PER_USER;
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <DashboardHeader
        title={t.dashboard_title}
        description={t.dashboard_desc}
      />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/30">
          {t.dashboard_sites_count(sites.length, MAX_SITES_PER_USER)}
        </p>
        {canCreateMore && (
          <Link href="/builder">
            <Button size="sm" icon={<Plus size={14} />}>{t.dashboard_new_site}</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/3 border border-white/8 shimmer" />
          ))}
        </div>
      ) : (
        <SiteGrid sites={sites} />
      )}
    </motion.div>
  );
}
