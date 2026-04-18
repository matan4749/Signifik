'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLang } from '@/lib/i18n/context';

export function EmptyState() {
  const { t } = useLang();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-5">
        <Sparkles size={28} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{t.empty_title}</h3>
      <p className="text-white/40 text-sm max-w-xs mb-8">
        {t.empty_desc}
      </p>
      <Link href="/builder">
        <Button size="lg" icon={<Plus size={18} />}>
          {t.empty_cta}
        </Button>
      </Link>
    </div>
  );
}
