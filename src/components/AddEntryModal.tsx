'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEntryModal({ isOpen, onClose }: AddEntryModalProps) {
  const { t } = useLocale();
  const { addStudent } = useStore();
  
  const [uid, setUid] = useState('');
  const [id, setId] = useState('');
  const [nameEN, setNameEN] = useState('');
  const [nameAR, setNameAR] = useState('');
  const [allowSelfEdit, setAllowSelfEdit] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim() || !id.trim() || !nameEN.trim() || !nameAR.trim()) return;

    addStudent({
      uid: uid.trim(),
      id: id.trim(),
      nameEN: nameEN.trim(),
      nameAR: nameAR.trim(),
      percentage: 100, // Default for new students
      scannedAt: null,
      allowSelfEdit,
    });
    
    toast.success(t.toastStudentAdded);
    setUid('');
    setId('');
    setNameEN('');
    setNameAR('');
    setAllowSelfEdit(true);
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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-border shadow-2xl"
          >
            <div className="bg-gradient-to-r from-accent to-accent-2 px-6 py-4 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-bg">{t.addStudentTitle}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentUID}</label>
                    <input type="text" required value={uid} onChange={e => setUid(e.target.value)} placeholder={t.uidPlaceholder} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentID}</label>
                    <input type="text" required value={id} onChange={e => setId(e.target.value)} placeholder={t.idPlaceholder} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameEN}</label>
                  <input type="text" required dir="ltr" value={nameEN} onChange={e => setNameEN(e.target.value)} placeholder={t.nameen_placeholder} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameAR}</label>
                  <input type="text" required dir="rtl" value={nameAR} onChange={e => setNameAR(e.target.value)} placeholder={t.namearPlaceholder} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={allowSelfEdit} onChange={e => setAllowSelfEdit(e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                  <span className="text-sm font-medium text-text">{t.allowSelfEdit}</span>
                </label>
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-surface-2 px-4 py-3 font-semibold text-text hover:bg-surface-2/80">{t.cancel}</button>
                <button type="submit" className="flex-1 rounded-xl bg-accent px-4 py-3 font-bold text-bg hover:scale-[1.02] active:scale-95">{t.save}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
