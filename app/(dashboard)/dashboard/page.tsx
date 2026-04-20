'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Globe, Image as ImageIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui';
import { SiteGrid } from '@/components/dashboard/SiteGrid';
import { useAuth } from '@/hooks/useAuth';
import { useSites } from '@/hooks/useSites';
import { MAX_SITES_PER_USER } from '@/lib/utils/constants';
import { useLang } from '@/lib/i18n/context';

export const dynamic = 'force-dynamic';

function greeting(name: string | null) {
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב';
  return name ? `${timeGreet}, ${name.split(' ')[0]} 👋` : `${timeGreet} 👋`;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { sites, loading: sitesLoading } = useSites(user?.uid);
  const canCreateMore = sites.length < MAX_SITES_PER_USER;
  const { t } = useLang();

  const loading = authLoading || sitesLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {loading ? (
              <span className="inline-block h-7 w-48 rounded-lg bg-white/5 shimmer" />
            ) : (
              greeting(user?.displayName ?? null)
            )}
          </h1>
          <p className="mt-1 text-sm text-white/40">{t.dashboard_desc}</p>
        </div>
        {!loading && canCreateMore && (
          <Link href="/builder">
            <Button size="sm" icon={<Plus size={14} />}>{t.dashboard_new_site}</Button>
          </Link>
        )}
      </div>

      {/* Quick actions — only when user has sites */}
      {!loading && sites.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">פעולות מהירות</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/builder">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Plus size={15} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-white/70">אתר חדש</span>
              </div>
            </Link>

            {/* Quick link to edit images of first site */}
            <Link href={`/sites/${sites[0].id}`}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ImageIcon size={15} className="text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-white/70">ערוך תמונות</span>
              </div>
            </Link>

            <Link href="/account">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all">
                <div className="h-8 w-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                  <Settings size={15} className="text-white/50" />
                </div>
                <span className="text-sm font-medium text-white/70">הגדרות</span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Sites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
            {t.dashboard_title}
          </p>
          <p className="text-xs text-white/25">
            {!loading && t.dashboard_sites_count(sites.length, MAX_SITES_PER_USER)}
          </p>
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
      </div>
    </motion.div>
  );
}
