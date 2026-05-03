'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Student } from '@/contexts/StoreContext';
import StatusBadge from './StatusBadge';
import QRModal from './QRModal';
import EditEntryModal from './EditEntryModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { motion } from 'framer-motion';

interface StudentRowProps {
  student: Student;
  index: number;
}

export default function StudentRow({ student, index }: StudentRowProps) {
  const { t, locale } = useLocale();
  const { isAdmin } = useAuth();
  
  const [isQROpen, setIsQROpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isPresent = !!student.scannedAt;
  
  // Format time if present
  const timeString = student.scannedAt 
    ? new Date(student.scannedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.18 } }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          delay: Math.min(index * 0.04, 0.4),
        }}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,232,162,0.12)' }}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-surface p-4 border border-border/50 hover:border-border mb-3 cursor-default"
      >
        {/* Info Section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-lg font-bold text-accent border border-border">
            {student.nameEN.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-text">
              {locale === 'ar' ? student.nameAR : student.nameEN}
            </span>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
              <span className="font-mono">{student.id}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{student.percentage}% {t.attendance}</span>
            </div>
          </div>
        </div>

        {/* Status & Actions Section */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
          <div className="flex flex-col items-start sm:items-end gap-1">
            <StatusBadge present={isPresent} />
            {isPresent && (
              <span className="text-xs text-text-muted font-mono">{timeString}</span>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setIsQROpen(true)}
                title={t.showQR}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-text-muted transition-colors hover:bg-accent hover:text-bg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
              </button>
              
              <button
                onClick={() => setIsEditOpen(true)}
                title={t.editEntry}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-text-muted transition-colors hover:bg-surface hover:text-accent border border-transparent hover:border-accent/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              
              <button
                onClick={() => setIsDeleteOpen(true)}
                title={t.deleteEntry}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} uid={student.uid} />
      <EditEntryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} student={student} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} uid={student.uid} name={locale === 'ar' ? student.nameAR : student.nameEN} />
    </>
  );
}
