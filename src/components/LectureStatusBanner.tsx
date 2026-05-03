/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';

export default function LectureStatusBanner() {
  const { activeLecture, state } = useStore();
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

  const total = state.students.length;
  const attending = activeLecture.attendees.length;
  const absent = total - attending;
  const percentage = total > 0 ? Math.round((attending / total) * 100) : 0;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-surface-2 p-1 shadow-lg">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-2/20 to-accent/20 opacity-50 blur-xl" />
      
      <div className="relative rounded-xl bg-surface border border-border overflow-hidden">
        {/* Top row */}
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
              <span className="relative h-4 w-4 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-text">
                  {locale === 'ar' ? activeLecture.nameAR : activeLecture.name}
                </h2>
                <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent border border-accent/20">
                  {t.activeLecture}
                </span>
              </div>
              {/* Stat pills */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {attending} {t.present}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 border border-danger/20 px-2.5 py-0.5 text-xs font-bold text-danger">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                  {absent} {t.absent}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                  percentage >= 75 ? 'bg-accent/10 border-accent/20 text-accent'
                  : percentage >= 50 ? 'bg-warning/10 border-warning/20 text-warning'
                  : 'bg-danger/10 border-danger/20 text-danger'
                }`}>
                  {percentage}% {t.attendance}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 rounded-lg bg-surface-2 px-6 py-3 border border-border shadow-inner shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.elapsed}</span>
              <span className="text-2xl font-mono font-bold text-accent tracking-tight tabular-nums">
                {elapsed}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance progress bar */}
        <div className="h-1.5 bg-surface-2">
          <div
            className={`h-full transition-all duration-1000 ${
              percentage >= 75 ? 'bg-gradient-to-r from-accent to-accent-2'
              : percentage >= 50 ? 'bg-gradient-to-r from-warning to-accent'
              : 'bg-gradient-to-r from-danger to-warning'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
