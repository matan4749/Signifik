'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SiteCard } from './SiteCard';
import { EmptyState } from './EmptyState';
import type { Site } from '@/types/site';
import { MAX_SITES_PER_USER } from '@/lib/utils/constants';

interface SiteGridProps {
  sites: Site[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
};

export function SiteGrid({ sites }: SiteGridProps) {
  const canCreateMore = sites.length < MAX_SITES_PER_USER;

  if (sites.length === 0) return <EmptyState />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {sites.map((site) => (
        <motion.div key={site.id} variants={item}>
          <SiteCard site={site} />
        </motion.div>
      ))}

      {canCreateMore && (
        <motion.div variants={item}>
          <Link href="/builder" className="group block h-full">
            <div className="h-full min-h-[176px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/40 hover:bg-white/3 transition-all duration-200">
              <Plus size={20} className="text-white/20 group-hover:text-indigo-400 transition-colors" />
              <span className="text-sm text-white/20 group-hover:text-indigo-400 transition-colors font-medium">
                Add Site
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
