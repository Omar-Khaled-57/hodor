'use client';
import { useLocale } from '@/contexts/LocaleContext';

export default function ThemeToggle() {
  const { toggleLocale, locale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text transition-transform hover:scale-105 active:scale-95"
      aria-label="Toggle language"
    >
      <span className="font-bold text-sm uppercase">{locale === 'en' ? 'AR' : 'EN'}</span>
    </button>
  );
}
