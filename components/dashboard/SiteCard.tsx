'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Settings, Globe } from 'lucide-react';
import { DeployStatusBadge } from './DeployStatusBadge';
import { spring, springSnappy } from '@/lib/utils/motion';
import type { Site } from '@/types/site';
import { useLang } from '@/lib/i18n/context';

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const { t } = useLang();
  const design = site.config?.design;
  const primaryColor = design?.primaryColor ?? '#6366f1';
  const accentColor = design?.accentColor ?? '#8b5cf6';
  const isLive = site.deployment?.status === 'ready';
  const deployStatus = site.deployment?.status ?? 'pending';

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01, transition: spring }}
      whileTap={{ scale: 0.985, transition: springSnappy }}
      className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-default"
      style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
    >
      {/* Gradient color strip */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {site.config?.media?.logoUrl ? (
              <img
                src={site.config.media.logoUrl}
                alt={site.name}
                className="h-8 w-8 rounded-lg object-contain bg-white/5 border border-white/10"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${accentColor}22)` }}
              >
                <Globe size={14} className="text-white/50" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                {site.config?.businessName ?? site.name}
              </h3>
              <p className="text-xs text-white/30 mt-0.5 capitalize">{site.config?.niche ?? ''}</p>
            </div>
          </div>

          {isLive ? (
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(52,211,153,0)',
                  '0 0 0 6px rgba(52,211,153,0.2)',
                  '0 0 0 0 rgba(52,211,153,0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              className="rounded-full"
            >
              <DeployStatusBadge status={deployStatus} />
            </motion.div>
          ) : (
            <DeployStatusBadge status={deployStatus} />
          )}
        </div>

        <p className="text-xs text-white/40 mb-4 line-clamp-2 leading-relaxed">
          {site.config?.tagline ?? ''}
        </p>

        <div className="flex items-center gap-3">
          {isLive && site.deployment?.url && (
            <a
              href={site.deployment.url}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={11} />
              {t.site_view}
            </a>
          )}
          <div className="flex-1" />
          <Link
            href={`/builder/${site.id}`}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <Settings size={11} />
            {t.site_edit}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
