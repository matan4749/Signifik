'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';
import { useLang } from '@/lib/i18n/context';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLang();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen liquid-bg flex items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{t.error_title}</h2>
        <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
          {t.error_desc}
        </p>
        <Button onClick={reset}>{t.error_retry}</Button>
      </div>
    </div>
  );
}
