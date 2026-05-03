/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n/strings';
import { strings } from '@/i18n/strings';

interface LocaleContextValue {
  locale: Locale;
  t: typeof strings.en;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  dir: 'rtl' | 'ltr';
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: strings.en,
  setLocale: () => {},
  toggleLocale: () => {},
  dir: 'ltr',
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('hodor-locale') as Locale | null;
    if (stored === 'ar' || stored === 'en') {
      setLocaleState(stored);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language || '';
      setLocaleState(browserLang.startsWith('ar') ? 'ar' : 'en');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', locale);
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('hodor-locale', locale);
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);
  const toggleLocale = () => setLocaleState(l => (l === 'ar' ? 'en' : 'ar'));

  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: strings[locale],
        setLocale,
        toggleLocale,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
