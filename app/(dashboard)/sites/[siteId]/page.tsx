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
import { SiteImageEditor } from '@/components/dashboard/SiteImageEditor';
import { staggerContainer, staggerItem } from '@/lib/utils/motion';
import type { Site, SiteMedia } from '@/types/site';
import { useLang } from '@/lib/i18n/context';

export const dynamic = 'force-dynamic';

export default function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    fetch(`/api/sites/${siteId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) { router.push('/dashboard'); return; }
        const data = await res.json() as Site;
        setSite({ ...data, id: siteId });
        setLoading(false);
      })
      .catch(() => router.push('/dashboard'));
  }, [siteId, router]);

  const handleMediaChange = (media: SiteMedia) => {
    setSite((s) => s ? { ...s, config: { ...s.config, media } } : s);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-xl bg-white/5 shimmer" />
        <div className="h-64 rounded-2xl bg-white/5 shimmer" />
      </div>
    );
  }

  if (!site) return null;

  const hasGallery = site.config.components.includes('image-gallery');

  return (
    <motion.div
      variants={staggerContainer(80)}
      initial="hidden"
      animate="show"
    >
      {/* Back + title row */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <DashboardHeader
          title={site.config.businessName}
          description={site.config.tagline}
        />
      </div>

      {/* Status + actions row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <DeployStatusBadge status={site.deployment.status} />
        {site.deployment.url && site.deployment.status === 'ready' && (
          <a
            href={site.deployment.url}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors truncate"
          >
            <ExternalLink size={12} />
            <span className="max-w-[180px] sm:max-w-none truncate">{site.deployment.url}</span>
          </a>
        )}
        <div className="flex-1" />
        <Link href={`/builder/${siteId}`}>
          <Button size="sm" variant="secondary" icon={<Settings size={14} />}>
            {t.edit_site}
          </Button>
        </Link>
      </div>

      {/* Analytics */}
      <motion.div variants={staggerItem} className="mb-8">
        <InsightWidget siteId={siteId} siteName={site.config.businessName} />
      </motion.div>

      {/* Dynamic image management */}
      <motion.div
        variants={staggerItem}
        className="glass rounded-2xl p-5 sm:p-6"
      >
        <SiteImageEditor
          siteId={siteId}
          media={site.config.media}
          hasGallery={hasGallery}
          onChange={handleMediaChange}
        />
      </motion.div>
    </motion.div>
  );
}
