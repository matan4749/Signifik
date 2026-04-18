'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

// Use a structural type that accepts either he or en translations
type TranslationSet = typeof translations.he | typeof translations.en;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationSet;
}

const LangContext = createContext<LangContextValue>({
  lang: 'he',
  setLang: () => {},
  t: translations.he,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('he');

  useEffect(() => {
    const stored = localStorage.getItem('signifik_lang') as Lang | null;
    if (stored === 'en' || stored === 'he') setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem('signifik_lang', l);
    setLangState(l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
