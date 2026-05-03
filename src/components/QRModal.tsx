'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useLocale } from '@/contexts/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
}

export default function QRModal({ isOpen, onClose, uid }: QRModalProps) {
  const { t } = useLocale();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}/${uid}`;

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
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="bg-surface-2 px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-text">{t.qrTitle}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col items-center">
              <div className="relative rounded-2xl bg-white p-4 shadow-[0_0_30px_var(--color-accent-glow)] ring-4 ring-accent/20">
                <QRCodeSVG
                  value={url}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#060B14" // DEVORA Dark background for high contrast
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="mt-6 text-center text-sm text-text-muted">
                {t.qrDesc}
              </p>
              <Link 
                href={`/${uid}`}
                onClick={onClose}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-surface-2 px-4 py-2 text-sm font-medium text-text border border-border hover:bg-surface-2/80 transition-colors w-full"
              >
                Go to Profile page
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              </Link>
            </div>

            {/* Footer */}
            <div className="bg-surface-2 p-4 flex justify-center">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-accent px-4 py-3 font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95"
              >
                {t.qrClose}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
