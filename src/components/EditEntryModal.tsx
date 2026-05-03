/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useStore, type Student } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export default function EditEntryModal({ isOpen, onClose, student }: EditEntryModalProps) {
  const { t } = useLocale();
  const { editStudent } = useStore();
  
  const [nameEN, setNameEN] = useState(student.nameEN);
  const [nameAR, setNameAR] = useState(student.nameAR);
  const [allowSelfEdit, setAllowSelfEdit] = useState(student.allowSelfEdit);

  useEffect(() => {
    if (isOpen) {
      setNameEN(student.nameEN);
      setNameAR(student.nameAR);
      setAllowSelfEdit(student.allowSelfEdit);
    }
  }, [isOpen, student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEN.trim() || !nameAR.trim()) return;

    editStudent(student.uid, {
      nameEN: nameEN.trim(),
      nameAR: nameAR.trim(),
      allowSelfEdit,
    });
    
    toast.success(t.toastStudentUpdated);
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
              <h3 className="text-xl font-bold text-bg">{t.editStudentTitle}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-muted">{t.studentUID}</label>
                    <div className="rounded-xl border border-border bg-surface-2/50 px-4 py-2 text-text-muted font-mono text-sm opacity-70">
                      {student.uid}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-muted">{t.studentID}</label>
                    <div className="rounded-xl border border-border bg-surface-2/50 px-4 py-2 text-text-muted font-mono text-sm opacity-70">
                      {student.id}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameEN}</label>
                  <input type="text" required dir="ltr" value={nameEN} onChange={e => setNameEN(e.target.value)} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameAR}</label>
                  <input type="text" required dir="rtl" value={nameAR} onChange={e => setNameAR(e.target.value)} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={allowSelfEdit} onChange={e => setAllowSelfEdit(e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                  <span className="text-sm font-medium text-text">{t.allowSelfEdit}</span>
                </label>
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-surface-2 px-4 py-3 font-semibold text-text hover:bg-surface-2/80">{t.cancel}</button>
                <button type="submit" className="flex-1 rounded-xl bg-accent px-4 py-3 font-bold text-bg hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_var(--color-accent-glow)]">{t.save}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
