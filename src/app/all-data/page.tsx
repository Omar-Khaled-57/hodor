'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StudentRow from '@/components/StudentRow';
import AddEntryModal from '@/components/AddEntryModal';
import { useStore } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'name' | 'percentage' | 'recent';

export default function AllDataPage() {
  const { state } = useStore();
  const { t, locale } = useLocale();
  const { isAdmin } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'recent', label: 'Recent Scan' },
  ];

  // Filter and Sort
  let displayedStudents = state.students.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.nameAR.toLowerCase().includes(q) ||
      s.nameEN.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.uid.toLowerCase().includes(q)
    );
  });

  displayedStudents = displayedStudents.sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = locale === 'ar' ? a.nameAR : a.nameEN;
      const nameB = locale === 'ar' ? b.nameAR : b.nameEN;
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'percentage') {
      return b.percentage - a.percentage;
    }
    if (sortBy === 'recent') {
      if (!a.scannedAt) return 1;
      if (!b.scannedAt) return -1;
      return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-text tracking-tight">{t.navAllData}</h1>
            <p className="text-text-muted mt-1">{state.students.length} students total</p>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-bold text-bg shadow-[0_0_15px_var(--color-accent-glow)] transition-transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {t.addEntry}
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-surface p-2 rounded-2xl border border-border">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-text placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <div className="flex items-center gap-2" ref={sortRef}>
            <span className="text-xs font-semibold text-text-muted uppercase px-2">{t.sortBy}:</span>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 py-2.5 pl-4 pr-3 text-sm font-medium text-text focus:outline-none border border-transparent hover:border-border transition-colors min-w-[140px]"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 top-full mt-2 w-full min-w-[140px] rounded-xl bg-surface border border-border shadow-xl overflow-hidden py-1 right-0 sm:right-auto"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.value 
                            ? 'bg-accent/10 text-accent font-bold' 
                            : 'text-text hover:bg-surface-2'
                        }`}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student, i) => (
                <StudentRow key={student.uid} student={student} index={i} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-text-muted"
              >
                No students found matching your criteria.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AddEntryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
