'use client';

import { useLang } from '@/lib/i18n/context';
import { cn } from '@/lib/utils/cn';

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15',
        'bg-white/5 hover:bg-white/10 transition-all duration-150',
        'text-xs font-medium text-white/60 hover:text-white/90',
        className
      )}
      aria-label="Toggle language"
    >
      <span className={lang === 'en' ? 'text-white' : 'text-white/35'}>EN</span>
      <span className="text-white/20">/</span>
      <span className={lang === 'he' ? 'text-white' : 'text-white/35'}>עב</span>
    </button>
  );
}
