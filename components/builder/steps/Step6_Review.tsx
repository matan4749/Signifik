'use client';

import { Button } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rocket, Globe, Palette, Phone, CheckCircle } from 'lucide-react';
import type { SiteConfig } from '@/types/site';
import { STYLE_TOKENS } from '@/lib/utils/constants';
import { useLang } from '@/lib/i18n/context';

interface Props {
  config: SiteConfig;
  slug: string;
  customDomain?: string;
  isSubmitting: boolean;
  onDeploy: () => void;
}

export function Step6_Review({ config, slug, customDomain, isSubmitting, onDeploy }: Props) {
  const { t } = useLang();
  const styleToken = STYLE_TOKENS[config.design.styleToken];
  const liveUrl = customDomain ? `https://${customDomain}` : `https://signifik.vercel.app/${slug}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step6_title}</h2>
        <p className="text-white/40">{t.step6_sub}</p>
      </div>

      <div className="space-y-4">
        <Card padding="sm">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white/70">{t.step6_section_business}</span>
          </div>
          <p className="text-white font-semibold">{config.businessName}</p>
          <p className="text-white/40 text-sm mt-0.5">{config.tagline}</p>
          <div className="mt-2">
            <Badge variant="info">{config.niche}</Badge>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3 mb-3">
            <Palette size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white/70">{t.step6_section_design}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: config.design.primaryColor }} />
              <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: config.design.accentColor }} />
            </div>
            <span className="text-sm text-white/60">{styleToken?.label}</span>
            <span className="text-sm text-white/30">• {config.design.fontFamily}</span>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3 mb-3">
            <Phone size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white/70">{t.step6_section_components}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {config.components.length > 0 ? (
              config.components.map((c) => (
                <Badge key={c} variant="default">{c.replace('-', ' ')}</Badge>
              ))
            ) : (
              <span className="text-sm text-white/30">No contact components selected</span>
            )}
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white/70">{t.step6_section_domain}</span>
          </div>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener"
            className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
          >
            {liveUrl}
          </a>
          {customDomain && (
            <p className="text-xs text-amber-400 mt-1">{t.step6_dns_reminder}</p>
          )}
        </Card>
      </div>

      <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-sm text-indigo-300">
            <p className="font-medium mb-1">{t.step6_what_next}</p>
            <ul className="space-y-1 text-indigo-300/70">
              <li>• {t.step6_what_1}</li>
              <li>• {t.step6_what_2}</li>
              <li>• {t.step6_what_3}</li>
              <li>• {t.step6_what_4}</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        onClick={onDeploy}
        size="lg"
        className="w-full"
        loading={isSubmitting}
        icon={<Rocket size={18} />}
      >
        {isSubmitting ? t.step6_deploying : t.step6_deploy}
      </Button>
    </div>
  );
}
