'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';

interface Props {
  slug: string;
  customDomain?: string;
  onSubmit: (slug: string, customDomain?: string) => void;
}

export function Step5_Domain({ slug: initSlug, customDomain: initDomain, onSubmit }: Props) {
  const [slug, setSlug] = useState(initSlug);
  const [useCustom, setUseCustom] = useState(!!initDomain);
  const [customDomain, setCustomDomain] = useState(initDomain || '');
  const [error, setError] = useState('');
  const { t } = useLang();

  const handleSubmit = () => {
    if (!slug.trim()) {
      setError('URL slug is required');
      return;
    }
    if (useCustom && customDomain && !/^[a-z0-9][a-z0-9\-]{1,61}[a-z0-9]\.[a-z]{2,}$/i.test(customDomain)) {
      setError(t.step5_domain_error);
      return;
    }
    onSubmit(slug.trim(), useCustom ? customDomain.trim() || undefined : undefined);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step5_title}</h2>
        <p className="text-white/40">{t.step5_sub}</p>
      </div>

      <Card className="space-y-5">
        <div>
          <label className="text-sm font-medium text-white/70 block mb-2">{t.step5_slug_label}</label>
          <div className="flex items-center">
            <span className="shrink-0 h-10 flex items-center px-3 rounded-l-xl bg-white/5 border border-r-0 border-white/10 text-xs text-white/30">
              signifik.vercel.app/
            </span>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                setError('');
              }}
              className={cn(
                'flex-1 h-10 rounded-r-xl bg-white/5 px-3 text-sm text-white',
                'border border-white/10 outline-none',
                'focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20',
                'transition-all duration-150'
              )}
              placeholder="my-business"
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          <p className="mt-1.5 text-xs text-white/30">{t.step5_slug_hint}</p>
        </div>

        {/* Custom domain option */}
        <div className="border-t border-white/8 pt-5">
          <button
            onClick={() => setUseCustom((v) => !v)}
            className={cn(
              'flex items-center gap-3 w-full p-4 rounded-xl border transition-all duration-150 text-left',
              useCustom
                ? 'border-indigo-500/40 bg-indigo-500/10'
                : 'border-white/10 bg-white/3 hover:bg-white/5'
            )}
          >
            <Globe size={18} className={useCustom ? 'text-indigo-400' : 'text-white/30'} />
            <div className="flex-1">
              <p className={cn('text-sm font-medium', useCustom ? 'text-indigo-300' : 'text-white/60')}>
                {t.step5_custom_domain}
              </p>
              <p className="text-xs text-white/30 mt-0.5">{t.step5_custom_domain_ph}</p>
            </div>
          </button>

          {useCustom && (
            <div className="mt-3 space-y-3">
              <Input
                placeholder="mybusiness.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                icon={<Globe size={14} />}
              />
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-xs text-amber-400 flex items-start gap-2">
                  <Lock size={12} className="mt-0.5 shrink-0" />
                  {t.step5_dns_hint}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Button onClick={handleSubmit} size="lg" className="w-full">
        {t.step5_next}
      </Button>
    </div>
  );
}
