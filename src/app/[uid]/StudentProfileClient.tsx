'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function StudentProfileClient({ uid }: { uid: string }) {
  const { state, editStudent } = useStore();
  const { t, locale } = useLocale();
  
  const student = state.students.find(s => s.uid === uid);
  
  const [nameEN, setNameEN] = useState(student?.nameEN || '');
  const [nameAR, setNameAR] = useState(student?.nameAR || '');
  const [id, setId] = useState(student?.id || '');

  useEffect(() => {
    if (student) {
      setNameEN(student.nameEN);
      setNameAR(student.nameAR);
      setId(student.id);
    }
  }, [student]);

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4 text-center">
          <div>
            <h1 className="text-3xl font-black text-danger mb-2">404</h1>
            <p className="text-text-muted">Student not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isEditAllowed = state.globalAllowSelfEdit && student.allowSelfEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditAllowed || !nameEN.trim() || !nameAR.trim()) return;

    editStudent(student.uid, {
      nameEN: nameEN.trim(),
      nameAR: nameAR.trim(),
      id: id.trim() || student.id,
    });
    
    toast.success(t.toastStudentUpdated);
  };

  // Find lectures student attended
  const attendedLectures = state.lectures.filter(l => l.attendees.includes(student.uid));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-black text-text mb-6">{t.myProfile}</h1>
        
        <div className="grid gap-6">
          {/* Card */}
          <div className="rounded-3xl bg-gradient-to-br from-surface to-surface-2 p-8 border border-border shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
            
            <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-4xl font-bold text-accent shadow-inner border border-border">
                {student.nameEN.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text mb-1">
                  {locale === 'ar' ? student.nameAR : student.nameEN}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-lg bg-surface px-3 py-1 text-text-muted font-mono">{student.id}</span>
                  <span className="rounded-lg bg-accent/10 px-3 py-1 text-accent font-bold">{student.percentage}% {t.attendance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="rounded-3xl bg-surface p-8 border border-border">
            <h3 className="text-lg font-bold text-text mb-2">{t.selfEditTitle}</h3>
            <p className="text-sm text-text-muted mb-6">{t.selfEditDesc}</p>
            
            <form onSubmit={handleSubmit} className={`space-y-4 transition-opacity duration-300 ${!isEditAllowed ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              <fieldset disabled={!isEditAllowed} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentID}</label>
                  <input type="text" required dir="ltr" value={id} onChange={e => setId(e.target.value)} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-surface disabled:text-text-muted disabled:border-transparent" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameEN}</label>
                  <input type="text" required dir="ltr" value={nameEN} onChange={e => setNameEN(e.target.value)} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-surface disabled:text-text-muted disabled:border-transparent" />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">{t.studentNameAR}</label>
                  <input type="text" required dir="rtl" value={nameAR} onChange={e => setNameAR(e.target.value)} className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-surface disabled:text-text-muted disabled:border-transparent" />
                </div>

                <button type="submit" className="mt-4 w-full rounded-xl bg-accent px-4 py-3.5 font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_var(--color-accent-glow)] disabled:hover:scale-100 disabled:shadow-none disabled:opacity-50">
                  {t.updateProfile}
                </button>
              </fieldset>
            </form>
          </div>

          {/* History */}
          <div className="rounded-3xl bg-surface p-8 border border-border">
            <h3 className="text-lg font-bold text-text mb-6">{t.lectureHistory}</h3>
            {attendedLectures.length > 0 ? (
              <div className="space-y-3">
                {attendedLectures.map(l => (
                  <div key={l.id} className="flex justify-between items-center p-4 rounded-xl bg-surface-2 border border-border/50">
                    <span className="font-semibold text-text">{locale === 'ar' ? l.nameAR : l.name}</span>
                    <span className="text-xs text-text-muted">{new Date(l.startedAt).toLocaleDateString(locale)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-4">{t.noHistory}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
