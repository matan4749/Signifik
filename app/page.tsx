'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Globe, Zap, Shield, Palette, Rocket, Phone } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Button } from '@/components/ui';
import { APP_NAME } from '@/lib/utils/constants';
import { useLang } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';

const featureIcons = [Zap, Palette, Phone, Globe, Shield, Rocket];

export default function HomePage() {
  const { t } = useLang();
  const { user, loading } = useAuth();
  const router = useRouter();

  // If already authenticated, go straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    { icon: featureIcons[0], title: t.feature_1_title, description: t.feature_1_desc },
    { icon: featureIcons[1], title: t.feature_2_title, description: t.feature_2_desc },
    { icon: featureIcons[2], title: t.feature_3_title, description: t.feature_3_desc },
    { icon: featureIcons[3], title: t.feature_4_title, description: t.feature_4_desc },
    { icon: featureIcons[4], title: t.feature_5_title, description: t.feature_5_desc },
    { icon: featureIcons[5], title: t.feature_6_title, description: t.feature_6_desc },
  ];

  const pricingFeatures = [
    t.pricing_feature_1,
    t.pricing_feature_2,
    t.pricing_feature_3,
    t.pricing_feature_4,
    t.pricing_feature_5,
    t.pricing_feature_6,
    t.pricing_feature_7,
    t.pricing_feature_8,
  ];

  const niches = t.niches.split(' / ');

  // Don't flash marketing page while checking auth
  if (loading || user) return null;

  return (
    <div className="min-h-screen liquid-bg text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            {t.hero_badge}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            {t.hero_headline_1}
            <br />
            <span className="text-gradient-brand">{t.hero_headline_2}</span>
          </h1>

          <p className="text-base sm:text-xl text-white/50 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {t.hero_sub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="w-full sm:w-auto px-8">
                {t.hero_cta}
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="glass" className="w-full sm:w-auto">
                {t.hero_signin}
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-white/25">
            <span>✓ {t.hero_trust_1}</span>
            <span>✓ {t.hero_trust_2}</span>
            <span>✓ {t.hero_trust_3}</span>
            <span>✓ {t.hero_trust_4}</span>
          </div>
        </div>
      </section>

      {/* Niche pills */}
      <section className="py-6 overflow-hidden border-y border-white/5">
        <div className="flex gap-3 justify-center flex-wrap px-4 sm:px-6">
          {niches.map((n) => (
            <span
              key={n}
              className="whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/30 border border-white/8 bg-white/3"
            >
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.features_title}</h2>
            <p className="text-white/40 text-base sm:text-lg">{t.features_sub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.pricing_title}</h2>
            <p className="text-white/40">{t.pricing_sub}</p>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 border border-indigo-500/20">
            <div className="text-center mb-8">
              <p className="text-sm text-indigo-400 font-medium mb-2">{t.pricing_plan}</p>
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold">{t.pricing_price}</span>
                <span className="text-white/40 mb-2">{t.pricing_period}</span>
              </div>
              <p className="text-sm text-white/30">{t.pricing_after_trial}</p>
            </div>

            <div className="space-y-3 mb-8">
              {pricingFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs">✓</span>
                  </div>
                  <span className="text-white/70">{f}</span>
                </div>
              ))}
            </div>

            <Link href="/signup" className="block">
              <Button size="lg" className="w-full">
                {t.pricing_cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-6 text-center">
        <p className="text-white/20 text-sm">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
