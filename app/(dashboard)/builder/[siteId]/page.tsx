'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ExternalLink, RefreshCw, Trash2, ChevronRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Card, CardTitle } from '@/components/ui/Card';
import { DeployStatusBadge } from '@/components/dashboard/DeployStatusBadge';
import { InsightWidget } from '@/components/dashboard/InsightWidget';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { SITE_COMPONENTS, STYLE_TOKENS } from '@/lib/utils/constants';
import type { Site, SiteComponent } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { Phone, MessageCircle, Mail, MapPin, Image } from 'lucide-react';
import { useLang } from '@/lib/i18n/context';

const iconMap: Record<string, React.ElementType> = {
  Phone, MessageCircle, Mail, MapPin, Image,
  Facebook: Phone, Instagram: MessageCircle,
};

type EditSection = 'hero' | 'contact' | 'design' | 'seo' | 'components';

export const dynamic = 'force-dynamic';

export default function EditSitePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { t } = useLang();

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [redeploying, setRedeploying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeSection, setActiveSection] = useState<EditSection>('hero');

  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaHref, setCtaHref] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [wazeAddress, setWazeAddress] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [components, setComponents] = useState<SiteComponent[]>([]);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#a78bfa');

  useEffect(() => {
    fetch(`/api/sites/${siteId}`)
      .then(async (res) => {
        if (!res.ok) { router.push('/dashboard'); return; }
        const s = await res.json() as Site;
        const data = { ...s, id: siteId };
        setSite(data);
        setLoading(false);
        setHeadline(data.config.hero.headline);
        setSubheadline(data.config.hero.subheadline);
        setCtaText(data.config.hero.ctaText);
        setCtaHref(data.config.hero.ctaHref);
        setPhone(data.config.contact.phone || '');
        setWhatsapp(data.config.contact.whatsapp || '');
        setEmail(data.config.contact.email || '');
        setWazeAddress(data.config.contact.wazeAddress || '');
        setFacebookUrl(data.config.contact.facebookUrl || '');
        setInstagramUrl(data.config.contact.instagramUrl || '');
        setSeoTitle(data.config.seo.title);
        setSeoDescription(data.config.seo.description);
        setComponents(data.config.components);
        setPrimaryColor(data.config.design.primaryColor);
        setAccentColor(data.config.design.accentColor);
      })
      .catch(() => router.push('/dashboard'));
  }, [siteId, router]);

  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            hero: { headline, subheadline, ctaText, ctaHref },
            contact: { phone, whatsapp, email, wazeAddress, facebookUrl, instagramUrl },
            seo: { title: seoTitle, description: seoDescription },
            components,
            design: { ...site.config.design, primaryColor, accentColor },
          },
        }),
      });
      if (!res.ok) throw new Error();
      success(t.editor_saved, t.editor_saved_desc);
    } catch {
      showError(t.editor_save_failed, t.editor_try_again);
    } finally {
      setSaving(false);
    }
  };

  const handleRedeploy = async () => {
    setRedeploying(true);
    try {
      await handleSave();
      const res = await fetch(`/api/sites/${siteId}/deploy`, { method: 'POST' });
      if (!res.ok) throw new Error('Deploy failed');
      success(t.editor_redeploy_success, t.editor_redeploy_success_desc);
    } catch {
      showError(t.editor_redeploy_failed, t.editor_try_again);
    } finally {
      setRedeploying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.editor_delete_confirm(site?.config.businessName ?? ''))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      success(t.editor_deleted, t.editor_deleted_desc);
      router.push('/dashboard');
    } catch {
      showError(t.editor_delete_failed, t.editor_try_again);
      setDeleting(false);
    }
  };

  const toggleComponent = (c: SiteComponent) => {
    setComponents((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
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

  const isLive = site.deployment.status === 'ready';
  const styleToken = STYLE_TOKENS[site.config.design.styleToken];
  const navSections: { id: EditSection; label: string }[] = [
    { id: 'hero', label: t.editor_nav_hero },
    { id: 'contact', label: t.editor_nav_contact },
    { id: 'components', label: t.editor_nav_components },
    { id: 'design', label: t.editor_nav_design },
    { id: 'seo', label: t.editor_nav_seo },
  ];

  return (
    <>
      <DashboardHeader
        title={site.config.businessName}
        description={site.config.tagline}
      />

      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <DeployStatusBadge status={site.deployment.status} />
        {isLive && site.deployment.url && (
          <a
            href={site.deployment.url}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ExternalLink size={12} />
            {site.deployment.url}
          </a>
        )}
        <div className="flex-1" />
        <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} loading={redeploying} onClick={handleRedeploy}>
          {t.editor_save_redeploy}
        </Button>
        <Button variant="primary" size="sm" icon={<Save size={14} />} loading={saving} onClick={handleSave}>
          {t.editor_save}
        </Button>
        <Button variant="danger" size="sm" icon={<Trash2 size={14} />} loading={deleting} onClick={handleDelete}>
          {t.editor_delete}
        </Button>
      </div>

      <div className="flex gap-6">
        <aside className="w-40 shrink-0 space-y-1">
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                activeSection === s.id
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              )}
            >
              {s.label}
              {activeSection === s.id && <ChevronRight size={12} />}
            </button>
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeSection === 'hero' && (
              <Card className="space-y-4">
                <CardTitle>{t.editor_hero_title}</CardTitle>
                <Input label={t.editor_headline} value={headline} onChange={(e) => setHeadline(e.target.value)} />
                <Input label={t.editor_subheadline} value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t.editor_cta_text} value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
                  <Input label={t.editor_cta_link} value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} />
                </div>
              </Card>
            )}

            {activeSection === 'contact' && (
              <Card className="space-y-4">
                <CardTitle>{t.editor_contact_title}</CardTitle>
                <Input label={t.editor_phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+972 50 000 0000" />
                <Input label={t.editor_whatsapp} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+972 50 000 0000" />
                <Input label={t.editor_email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@business.com" />
                <Input label={t.editor_waze} value={wazeAddress} onChange={(e) => setWazeAddress(e.target.value)} placeholder="123 Main St, Tel Aviv" hint={t.editor_waze_hint} />
                <Input label={t.editor_facebook} value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." />
                <Input label={t.editor_instagram} value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
              </Card>
            )}

            {activeSection === 'components' && (
              <Card className="space-y-4">
                <CardTitle>{t.editor_components_title}</CardTitle>
                <p className="text-xs text-white/30">{t.editor_components_sub}</p>
                <div className="grid grid-cols-2 gap-2">
                  {SITE_COMPONENTS.map((comp) => {
                    const Icon = iconMap[comp.icon] || Phone;
                    const isSelected = components.includes(comp.value as SiteComponent);
                    return (
                      <button
                        key={comp.value}
                        onClick={() => toggleComponent(comp.value as SiteComponent)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl border text-sm transition-all duration-150 text-left',
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
            )}

            {activeSection === 'design' && (
              <Card className="space-y-5">
                <CardTitle>{t.editor_design_title}</CardTitle>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/10">
                  <div className="flex gap-1.5">
                    <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: site.config.design.primaryColor }} />
                    <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: site.config.design.accentColor }} />
                  </div>
                  <span className="text-sm text-white/40">{styleToken?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-2">{t.editor_primary}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                      <span className="text-sm text-white/40 font-mono">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-2">{t.editor_accent}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                        className="h-10 w-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                      <span className="text-sm text-white/40 font-mono">{accentColor}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'seo' && (
              <Card className="space-y-4">
                <CardTitle>{t.editor_seo_title}</CardTitle>
                <Input label={t.editor_page_title} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} hint={t.editor_page_title_hint} />
                <div>
                  <label className="text-sm font-medium text-white/70 block mb-1.5">{t.editor_meta_desc}</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder={t.editor_meta_desc_ph}
                    className={cn(
                      'w-full rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white',
                      'border border-white/10 outline-none resize-none',
                      'placeholder:text-white/25 transition-all duration-150',
                      'focus:border-indigo-500/60 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/20'
                    )}
                  />
                  <p className="mt-1 text-xs text-white/30">{t.editor_chars(seoDescription.length)}</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-8">
        <InsightWidget siteId={siteId} siteName={site.config.businessName} />
      </div>
    </>
  );
}
