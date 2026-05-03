/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';

export default function LectureStatusBanner() {
  const { activeLecture } = useStore();
  const { t, locale } = useLocale();
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!activeLecture) {
      setElapsed('');
      return;
    }

    const start = new Date(activeLecture.startedAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const h = hours > 0 ? `${hours}:` : '';
      const m = mins.toString().padStart(2, '0');
      const s = secs.toString().padStart(2, '0');
      
      setElapsed(`${h}${m}:${s}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeLecture]);

  if (!activeLecture) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-surface-2 p-1 shadow-lg">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-2/20 to-accent/20 opacity-50 blur-xl" />
      
      <div className="relative flex flex-col items-center justify-between gap-4 rounded-xl bg-surface px-6 py-4 sm:flex-row border border-border">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
            <span className="relative h-4 w-4 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text">
                {locale === 'ar' ? activeLecture.nameAR : activeLecture.name}
              </h2>
              <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent border border-accent/20">
                {t.activeLecture}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              {t.attendeeCount.replace('student(s) present', `${activeLecture.attendees.length} student(s) present`)}
              {/* Replace logic is a bit hacky here, let's fix it */}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 rounded-lg bg-surface-2 px-6 py-3 border border-border shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.elapsed}</span>
            <span className="text-2xl font-mono font-bold text-accent tracking-tight tabular-nums">
              {elapsed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
