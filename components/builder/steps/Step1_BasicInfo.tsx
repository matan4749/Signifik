'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { slugify } from '@/lib/utils/slugify';
import { NICHES } from '@/lib/utils/constants';
import type { Niche } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';

interface Props {
  businessName: string;
  tagline: string;
  niche: Niche;
  onSubmit: (businessName: string, tagline: string, niche: Niche, slug: string) => void;
}

export function Step1_BasicInfo({ businessName: initName, tagline: initTagline, niche: initNiche, onSubmit }: Props) {
  const [businessName, setBusinessName] = useState(initName);
  const [tagline, setTagline] = useState(initTagline);
  const [niche, setNiche] = useState<Niche>(initNiche);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLang();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!businessName.trim()) e.businessName = 'Business name is required';
    if (!tagline.trim()) e.tagline = 'Tagline is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit(businessName.trim(), tagline.trim(), niche, slugify(businessName));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step1_title}</h2>
        <p className="text-white/40">{t.step1_sub}</p>
      </div>

      <Card className="space-y-5">
        <Input
          label={t.step1_name}
          placeholder={t.step1_name_ph}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          error={errors.businessName}
          autoFocus
        />
        <Input
          label={t.step1_tagline}
          placeholder={t.step1_tagline_ph}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          error={errors.tagline}
          hint={t.step1_tagline_hint}
        />

        <div>
          <label className="text-sm font-medium text-white/70 block mb-2">{t.step1_niche}</label>
          <div className="grid grid-cols-3 gap-2">
            {NICHES.map((n) => (
              <button
                key={n.value}
                onClick={() => setNiche(n.value as Niche)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150 border',
                  niche === n.value
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {businessName && (
        <p className="text-xs text-white/30">
          {t.step1_url_prefix} <span className="text-indigo-400">signifik.vercel.app/{slugify(businessName)}</span>
        </p>
      )}

      <Button onClick={handleSubmit} size="lg" className="w-full">
        {t.step1_next}
      </Button>
    </div>
  );
}
