'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SimulationBanner from '@/components/SimulationBanner';
import LectureStatusBanner from '@/components/LectureStatusBanner';
import StudentRow from '@/components/StudentRow';
import StartLectureModal from '@/components/StartLectureModal';
import AddEntryModal from '@/components/AddEntryModal';
import LectureReportModal from '@/components/LectureReportModal';
import { useStore, type Lecture } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { state, activeLecture, finishLecture } = useStore();
  const { t } = useLocale();
  const { isAdmin } = useAuth();
  
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reportLecture, setReportLecture] = useState<Lecture | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Get students for the active lecture
  const feedStudents = activeLecture
    ? activeLecture.attendees
        .map(uid => state.students.find(s => s.uid === uid))
        .filter((s): s is NonNullable<typeof s> => s !== undefined)
        // Sort by scannedAt descending (newest first)
        .sort((a, b) => {
          if (!a.scannedAt) return 1;
          if (!b.scannedAt) return -1;
          return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
        })
    : [];

  const handleFinishLecture = () => {
    if (!activeLecture) return;
    // Capture the lecture snapshot, finish it, then show report
    finishLecture();
    setReportLecture({ ...activeLecture, endedAt: new Date().toISOString() });
    setIsReportOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <SimulationBanner />
        {activeLecture ? (
          <>
            <LectureStatusBanner />
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-text">{t.navHome}</h1>
              {isAdmin && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="rounded-xl bg-surface-2 border border-border px-4 py-2 font-semibold text-text transition-all hover:bg-surface-2/80 active:scale-95 text-sm"
                  >
                    {t.addEntry}
                  </button>
                  <button
                    onClick={handleFinishLecture}
                    className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-2 font-semibold text-danger transition-all hover:bg-danger/20 active:scale-95 text-sm"
                  >
                    {t.finishLecture}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {feedStudents.length > 0 ? (
                  feedStudents.map((student, index) => (
                    <motion.div
                      key={student.uid}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <StudentRow student={student} index={index} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-2 text-text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                    </div>
                    <h3 className="text-lg font-bold text-text">{t.noStudents}</h3>
                    <p className="mt-1 text-sm text-text-muted">{t.noStudentsDesc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-surface to-surface-2 shadow-2xl border border-border transform rotate-12 transition-transform hover:rotate-0 duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
              </div>
            </motion.div>
            
            <h2 className="mb-3 text-3xl font-black text-text tracking-tight">{t.noActiveLecture}</h2>
            <p className="mb-8 max-w-md text-text-muted">{t.noActiveLectureDesc}</p>
            
            {isAdmin ? (
              <button
                onClick={() => setIsStartOpen(true)}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-bg shadow-[0_0_20px_var(--color-accent-glow)] transition-all hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                {t.startLecture}
              </button>
            ) : (
              <div className="rounded-xl bg-surface-2 px-6 py-3 text-sm font-medium text-text-muted border border-border">
                {t.noActiveLectureDesc}
              </div>
            )}
          </div>
        )}
      </main>

      <StartLectureModal isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />
      <AddEntryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {reportLecture && (
        <LectureReportModal
          isOpen={isReportOpen}
          onClose={() => { setIsReportOpen(false); }}
          lecture={reportLecture}
        />
      )}
    </div>
  );
}
