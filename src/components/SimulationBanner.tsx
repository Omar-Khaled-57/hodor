'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';

export default function SimulationBanner() {
  const { state, simulationActive, startSimulation, stopSimulation, startLecture, finishLecture, hideSimBanner, activeLecture } = useStore();
  const { t, locale } = useLocale();

  const isRtl = locale === 'ar';
  const hidden = state.simBannerHidden;

  const handleStop = () => {
    stopSimulation();
  };

  const handleStartMockLecture = () => {
    const now = new Date();
    startLecture({
      id: `SIM-${now.getTime()}`,
      name: 'Embedded Systems',
      nameAR: 'النظم المضمنة',
      startedAt: now.toISOString(),
      endedAt: null,
      attendees: [],
    });
    startSimulation();
  };

  return (
    <div className="relative mb-6" style={{ minHeight: simulationActive && !hidden ? 'auto' : '52px' }}>
      <AnimatePresence mode="popLayout">
        {simulationActive && !hidden ? (
          <motion.div
            key="banner"
            layout
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }}
            className="relative rounded-2xl border border-accent/40 bg-accent/10 p-0.5 shadow-lg"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 opacity-60 blur-xl" />
            </div>

            <div className="relative rounded-xl bg-surface p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-accent">{t.simulationBannerTitle}</p>
                  <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{t.simulationEnabledDesc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeLecture && (
                    <button
                      onClick={() => { finishLecture(); }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger transition-all hover:bg-danger/20 active:scale-95 border border-danger/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      {locale === 'ar' ? 'إيقاف محاضرة المحاكاة' : 'Stop the Simulation lecture'}
                    </button>
                  )}

                  <button
                    onClick={handleStop}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger transition-all hover:bg-danger/20 active:scale-95 border border-danger/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    {t.stopSimulation}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  {t.simulationActive}
                </span>
                {!activeLecture && (
                  <button
                    onClick={handleStartMockLecture}
                    className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent transition-all hover:bg-accent/25 active:scale-95 border border-accent/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    {locale === 'ar' ? 'ابدأ محاضرة لبدء المحاكاة' : 'Start a lecture to begin simulation'}
                  </button>
                )}
              </div>
            </div>

            {/* X close button at end-top corner, outside overflow-hidden */}
            <button
              onClick={hideSimBanner}
              className="absolute -top-2 -end-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-text-muted hover:bg-danger/20 hover:text-danger transition-colors active:scale-95 shadow-sm border border-border"
              aria-label="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </motion.div>
        ) : !simulationActive && !hidden ? (
          <motion.div
            key="starter"
            layout
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }}
            className="relative inline-block"
          >
            <button
              onClick={startSimulation}
              className="group relative inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-5 py-3 pr-10 text-sm font-bold text-accent transition-all hover:bg-accent/10 active:scale-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 group-hover:bg-accent/25 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </span>
              {t.startSimulation}
            </button>
            <button
              onClick={hideSimBanner}
              className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 text-text-muted hover:bg-danger/20 hover:text-danger transition-colors active:scale-95 shadow-sm border border-border"
              aria-label="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
