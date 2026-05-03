'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  name: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, uid, name }: ConfirmDeleteModalProps) {
  const { t } = useLocale();
  const { deleteStudent } = useStore();

  const handleDelete = () => {
    deleteStudent(uid);
    toast.success(t.toastStudentDeleted);
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
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-surface border border-danger/30 shadow-2xl"
          >
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">{t.deleteTitle}</h3>
              <p className="text-sm text-text-muted mb-4">
                {t.deleteDesc}
              </p>
              <div className="rounded-xl bg-surface-2 p-3 border border-border">
                <p className="font-bold text-text">{name}</p>
                <p className="text-xs text-text-muted font-mono">{uid}</p>
              </div>
            </div>

            <div className="bg-surface-2 p-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-surface px-4 py-3 font-semibold text-text border border-border hover:bg-surface/80"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-danger px-4 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              >
                {t.confirmDelete}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
