'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface StartLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartLectureModal({ isOpen, onClose }: StartLectureModalProps) {
  const { t } = useLocale();
  const { startLecture } = useStore();
  
  const [nameEN, setNameEN] = useState('');
  const [nameAR, setNameAR] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEN.trim() || !nameAR.trim()) return;

    const id = `LEC-${Date.now().toString().slice(-6)}`;
    startLecture({
      id,
      name: nameEN.trim(),
      nameAR: nameAR.trim(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      attendees: [],
    });
    
    toast.success(t.toastLectureStarted);
    setNameEN('');
    setNameAR('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl"
          >
            <div className="bg-gradient-to-r from-accent to-accent-2 px-6 py-4">
              <h3 className="text-xl font-bold text-bg">{t.startLectureTitle}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    {t.lectureNameEN}
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={nameEN}
                    onChange={(e) => setNameEN(e.target.value)}
                    placeholder={t.lectureNameENPlaceholder}
                    className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-text placeholder-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    {t.lectureNameAR}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={nameAR}
                    onChange={(e) => setNameAR(e.target.value)}
                    placeholder={t.lectureNameARPlaceholder}
                    className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-text placeholder-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-surface-2 px-4 py-3 font-semibold text-text transition-colors hover:bg-surface-2/80"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-accent px-4 py-3 font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_var(--color-accent-glow)]"
                >
                  {t.startBtn}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
