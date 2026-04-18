'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { SITE_COMPONENTS } from '@/lib/utils/constants';
import type { SiteConfig, SiteComponent } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { Phone, MessageCircle, Mail, MapPin, Image } from 'lucide-react';
import { useLang } from '@/lib/i18n/context';
// Facebook and Instagram icons not in lucide-react, use placeholders
const Facebook = Phone;
const Instagram = MessageCircle;

const iconMap: Record<string, React.ElementType> = {
  Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Image,
};

interface Props {
  hero: SiteConfig['hero'];
  components: SiteComponent[];
  contact: SiteConfig['contact'];
  onSubmit: (hero: SiteConfig['hero'], components: SiteComponent[], contact: SiteConfig['contact']) => void;
}

export function Step3_Content({ hero: initHero, components: initComponents, contact: initContact, onSubmit }: Props) {
  const [hero, setHero] = useState(initHero);
  const [components, setComponents] = useState<SiteComponent[]>(initComponents);
  const [contact, setContact] = useState(initContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLang();

  const toggleComponent = (c: SiteComponent) => {
    setComponents((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!hero.headline.trim()) e.headline = 'Headline is required';
    if (!hero.subheadline.trim()) e.subheadline = 'Subheadline is required';
    if (!hero.ctaText.trim()) e.ctaText = 'CTA text is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit(hero, components, contact);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step3_title}</h2>
        <p className="text-white/40">{t.step3_sub}</p>
      </div>

      <Card className="space-y-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{t.step3_hero}</h3>
        <Input
          label={t.step3_headline}
          placeholder={t.step3_headline_ph}
          value={hero.headline}
          onChange={(e) => setHero((h) => ({ ...h, headline: e.target.value }))}
          error={errors.headline}
        />
        <Input
          label={t.step3_subheadline}
          placeholder={t.step3_subheadline_ph}
          value={hero.subheadline}
          onChange={(e) => setHero((h) => ({ ...h, subheadline: e.target.value }))}
          error={errors.subheadline}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.step3_cta_text}
            placeholder={t.step3_cta_text_default}
            value={hero.ctaText}
            onChange={(e) => setHero((h) => ({ ...h, ctaText: e.target.value }))}
            error={errors.ctaText}
          />
          <Input
            label={t.step3_cta_link}
            placeholder="#contact or tel:+..."
            value={hero.ctaHref}
            onChange={(e) => setHero((h) => ({ ...h, ctaHref: e.target.value }))}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{t.step3_components}</h3>
        <p className="text-xs text-white/30">{t.step3_components_sub}</p>
        <div className="grid grid-cols-2 gap-2">
          {SITE_COMPONENTS.map((comp) => {
            const Icon = iconMap[comp.icon] || Phone;
            const isSelected = components.includes(comp.value as SiteComponent);
            return (
              <button
                key={comp.value}
                onClick={() => toggleComponent(comp.value as SiteComponent)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl border text-left text-sm transition-all duration-150',
                  isSelected
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                    : 'border-white/10 bg-white/3 text-white/50 hover:text-white/70 hover:bg-white/6'
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="font-medium">{comp.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {components.length > 0 && (
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{t.step3_contact}</h3>
          {components.includes('direct-call') && (
            <Input label={t.step3_phone} placeholder="+972 50 000 0000" value={contact.phone || ''}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
          )}
          {components.includes('whatsapp') && (
            <Input label={t.step3_whatsapp} placeholder="+972 50 000 0000" value={contact.whatsapp || ''}
              onChange={(e) => setContact((c) => ({ ...c, whatsapp: e.target.value }))} />
          )}
          {components.includes('email') && (
            <Input label={t.step3_email} placeholder={t.step3_email_ph} value={contact.email || ''}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
          )}
          {components.includes('waze') && (
            <Input label={t.step3_waze} placeholder={t.step3_waze_ph} value={contact.wazeAddress || ''}
              onChange={(e) => setContact((c) => ({ ...c, wazeAddress: e.target.value }))}
              hint={t.step3_waze_hint} />
          )}
          {components.includes('facebook') && (
            <Input label={t.step3_facebook} placeholder="https://facebook.com/yourpage" value={contact.facebookUrl || ''}
              onChange={(e) => setContact((c) => ({ ...c, facebookUrl: e.target.value }))} />
          )}
          {components.includes('instagram') && (
            <Input label={t.step3_instagram} placeholder="https://instagram.com/yourprofile" value={contact.instagramUrl || ''}
              onChange={(e) => setContact((c) => ({ ...c, instagramUrl: e.target.value }))} />
          )}
        </Card>
      )}

      <Button onClick={handleSubmit} size="lg" className="w-full">
        {t.step3_next}
      </Button>
    </div>
  );
}
