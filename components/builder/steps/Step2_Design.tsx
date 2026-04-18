'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { STYLE_TOKENS, FONT_OPTIONS } from '@/lib/utils/constants';
import type { SiteDesign, StyleToken, FontFamily } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';

interface Props {
  design: SiteDesign;
  onSubmit: (design: SiteDesign) => void;
}

export function Step2_Design({ design: initDesign, onSubmit }: Props) {
  const [design, setDesign] = useState<SiteDesign>(initDesign);
  const { t } = useLang();

  const update = (patch: Partial<SiteDesign>) => setDesign((d) => ({ ...d, ...patch }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step2_title}</h2>
        <p className="text-white/40">{t.step2_sub}</p>
      </div>

      <Card className="space-y-6">
        {/* Style Tokens */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-3">{t.step2_style}</label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(STYLE_TOKENS).map(([key, token]) => (
              <button
                key={key}
                onClick={() => update({ styleToken: key as StyleToken, primaryColor: token.primaryColor, accentColor: token.accentColor })}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-150',
                  design.styleToken === key
                    ? 'border-indigo-500/40 bg-indigo-500/10'
                    : 'border-white/10 bg-white/3 hover:bg-white/6'
                )}
              >
                <div className="flex gap-2 shrink-0">
                  <div
                    className="h-6 w-6 rounded-full border border-white/10"
                    style={{ backgroundColor: token.primaryColor }}
                  />
                  <div
                    className="h-6 w-6 rounded-full border border-white/10"
                    style={{ backgroundColor: token.accentColor }}
                  />
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  design.styleToken === key ? 'text-indigo-300' : 'text-white/60'
                )}>
                  {token.label}
                </span>
                {design.styleToken === key && (
                  <span className="ml-auto text-xs text-indigo-400 font-medium">{t.step2_selected}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-3">{t.step2_typography}</label>
          <div className="grid grid-cols-2 gap-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => update({ fontFamily: f.value as FontFamily })}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm border transition-all duration-150 text-left',
                  design.fontFamily === f.value
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                    : 'border-white/10 bg-white/3 text-white/50 hover:text-white/70 hover:bg-white/6'
                )}
              >
                <span className="font-medium">{f.label.split(' ')[0]}</span>
                <span className="text-xs text-white/30 ml-1">({f.label.split('(')[1]?.replace(')', '') || ''})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">{t.step2_primary}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <span className="text-sm text-white/40 font-mono">{design.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">{t.step2_accent}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={design.accentColor}
                onChange={(e) => update({ accentColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <span className="text-sm text-white/40 font-mono">{design.accentColor}</span>
            </div>
          </div>
        </div>
      </Card>

      <Button onClick={() => onSubmit(design)} size="lg" className="w-full">
        {t.step2_next}
      </Button>
    </div>
  );
}
