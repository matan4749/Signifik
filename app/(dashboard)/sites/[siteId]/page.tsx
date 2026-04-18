'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DeployStatusBadge } from '@/components/dashboard/DeployStatusBadge';
import { InsightWidget } from '@/components/dashboard/InsightWidget';
import { subscribeToSite } from '@/lib/firebase/firestore';
import { staggerContainer, staggerItem } from '@/lib/utils/motion';
import type { Site } from '@/types/site';
import { useLang } from '@/lib/i18n/context';

export const dynamic = 'force-dynamic';

export default function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const unsub = subscribeToSite(siteId, (s) => {
      if (!s) { router.push('/dashboard'); return; }
      setSite(s);
      setLoading(false);
    });
    return unsub;
  }, [siteId, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-xl bg-white/5 shimmer" />
        <div className="h-64 rounded-2xl bg-white/5 shimmer" />
      </div>
    );
  }

  if (!site) return null;

  return (
    <motion.div
      variants={staggerContainer(80)}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <DashboardHeader
          title={site.config.businessName}
          description={site.config.tagline}
        />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <DeployStatusBadge status={site.deployment.status} />
        {site.deployment.url && site.deployment.status === 'ready' && (
          <a
            href={site.deployment.url}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ExternalLink size={12} />
            {site.deployment.url}
          </a>
        )}
        <div className="flex-1" />
        <Link href={`/builder/${siteId}`}>
          <Button size="sm" variant="secondary" icon={<Settings size={14} />}>
            {t.edit_site}
          </Button>
        </Link>
      </div>

      {/* Analytics widget */}
      <motion.div variants={staggerItem}>
        <InsightWidget siteId={siteId} siteName={site.config.businessName} />
      </motion.div>
    </motion.div>
  );
}
