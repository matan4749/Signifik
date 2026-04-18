'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { useLang } from '@/lib/i18n/context';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-screen liquid-bg flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-8xl font-bold text-white/10 mb-4">404</p>
        <h2 className="text-xl font-bold text-white mb-2">{t.not_found_title}</h2>
        <p className="text-white/40 text-sm mb-6">{t.not_found_desc}</p>
        <Link href="/dashboard">
          <Button>{t.not_found_cta}</Button>
        </Link>
      </div>
    </div>
  );
}
