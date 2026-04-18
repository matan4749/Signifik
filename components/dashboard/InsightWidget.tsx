'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Eye, MousePointerClick, BarChart3 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { staggerContainer, staggerItem } from '@/lib/utils/motion';
import { useLang } from '@/lib/i18n/context';

interface InsightWidgetProps {
  siteId: string;
  siteName: string;
}

export function InsightWidget({ siteId, siteName }: InsightWidgetProps) {
  const { summary, loading } = useAnalytics(siteId);
  const { t } = useLang();

  if (loading) {
    return (
      <Card className="space-y-4">
        <div className="h-5 w-36 rounded-lg bg-white/5 shimmer" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/3 shimmer" />
          ))}
        </div>
      </Card>
    );
  }

  const noData = !summary || summary.totalViews === 0;

  const TrendIcon = summary?.trend === 'up'
    ? TrendingUp
    : summary?.trend === 'down'
    ? TrendingDown
    : Minus;

  const trendColor = summary?.trend === 'up'
    ? 'text-emerald-400'
    : summary?.trend === 'down'
    ? 'text-red-400'
    : 'text-white/30';

  const trendLabel = summary?.trend === 'up'
    ? t.insight_trend_up
    : summary?.trend === 'down'
    ? t.insight_trend_down
    : t.insight_trend_neutral;

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-400" />
          {t.insight_title}
          <span className="text-xs text-white/30 font-normal">— {siteName}</span>
        </CardTitle>
        {summary && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={13} />
            <span className="capitalize">{trendLabel}</span>
          </div>
        )}
      </div>

      {noData ? (
        <div className="py-8 text-center">
          <p className="text-sm text-white/30">{t.insight_no_data}</p>
          <p className="text-xs text-white/20 mt-1">{t.insight_no_data_sub}</p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <motion.div
            variants={staggerContainer(60)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-3"
          >
            <motion.div variants={staggerItem}>
              <KpiCard
                icon={<Eye size={15} className="text-indigo-400" />}
                label={t.insight_views}
                value={summary!.totalViews.toLocaleString()}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <KpiCard
                icon={<MousePointerClick size={15} className="text-indigo-400" />}
                label={t.insight_clicks}
                value={summary!.totalClicks.toLocaleString()}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <KpiCard
                icon={<TrendingUp size={15} className="text-emerald-400" />}
                label={t.insight_cvr}
                value={`${summary!.cvr}%`}
                highlight
              />
            </motion.div>
          </motion.div>

          {/* Sparkline bar chart */}
          {summary!.days.length > 1 && (
            <div>
              <p className="text-xs text-white/30 mb-2">{t.insight_last_days(summary!.days.length)}</p>
              <SparkChart days={summary!.days} />
            </div>
          )}

          <p className="text-[11px] text-white/20">
            {t.insight_cvr_formula}
          </p>
        </>
      )}
    </Card>
  );
}

function KpiCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? 'border-emerald-500/20 bg-emerald-500/8'
          : 'border-white/8 bg-white/3'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">{icon}</div>
      <p className={`text-xl font-bold tracking-tight ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-[11px] text-white/30 mt-0.5">{label}</p>
    </div>
  );
}

function SparkChart({ days }: { days: { date: string; views: number; clicks: number }[] }) {
  const maxViews = Math.max(...days.map((d) => d.views), 1);

  return (
    <div className="flex items-end gap-1 h-12">
      {days.map((day, i) => {
        const heightPct = Math.max((day.views / maxViews) * 100, 4);
        return (
          <motion.div
            key={day.date}
            title={`${day.date}: ${day.views} views, ${day.clicks} clicks`}
            initial={{ height: 0 }}
            animate={{ height: `${heightPct}%` }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 280, damping: 28 }}
            className="flex-1 rounded-sm bg-indigo-500/40 hover:bg-indigo-500/70 transition-colors cursor-default min-h-[2px]"
          />
        );
      })}
    </div>
  );
}
