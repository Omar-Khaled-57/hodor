'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import ThemeToggle from './ThemeToggle';
import LangToggle from './LangToggle';

export default function Navbar() {
  const { t } = useLocale();
  const { isAdmin, logout } = useAuth();
  const { state, toggleGlobalEdit, simulationActive, startSimulation, stopSimulation } = useStore();
  const pathname = usePathname();
  const showGlobalEdit = pathname === '/' || pathname === '/all-data';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.navHome },
    { href: '/all-data', label: t.navAllData },
  ];

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_15px_var(--color-accent-glow)] transition-transform group-hover:scale-105">
              <span className="text-xl font-black text-bg">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold uppercase leading-none tracking-wider text-text">
                {t.appName}
              </span>
              <span className="text-xs font-medium text-accent">
                {t.by} {t.devora}
              </span>
            </div>
          </Link>
        </div>

        {/* Links Section (Center - Desktop) */}
        <div className="hidden flex-1 justify-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 text-sm font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions Section (Right/Left depending on RTL) */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-accent border border-border">
                {t.adminBadge}
              </span>
              {showGlobalEdit && (
                <button
                  onClick={toggleGlobalEdit}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                    state.globalAllowSelfEdit 
                      ? 'bg-danger/10 text-danger hover:bg-danger/20' 
                      : 'bg-accent/10 text-accent hover:bg-accent/20'
                  }`}
                >
                  {state.globalAllowSelfEdit ? t.blockEdit : t.allowEdit}
                </button>
              )}
              <button
                onClick={logout}
                className="text-sm font-medium text-text-muted transition-colors hover:text-danger"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-text transition-all hover:bg-surface-2/80 active:scale-95 md:block"
            >
              {t.navLogin}
            </Link>
          )}

          {/* Simulation toggle - visible to all visitors */}
          <div className="hidden md:flex items-center">
            {simulationActive ? (
              <button
                onClick={() => { stopSimulation(); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 border border-danger/30 px-3 py-1.5 text-xs font-bold text-danger transition-all hover:bg-danger/20 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                {t.stopSimulation}
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-bold text-accent transition-all hover:bg-accent/20 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                {t.startSimulation}
              </button>
            )}
          </div>

          <div className="hidden md:block h-6 w-px bg-border mx-1"></div>

          <LangToggle />
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-2 rounded-lg p-2 text-text hover:bg-surface-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-4 pt-4 border-t border-border flex flex-col gap-4 pb-2"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                          isActive ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        {isActive && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Simulation toggle - mobile */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.08 }}
                className="px-1"
              >
                {simulationActive ? (
                  <button
                    onClick={() => {
                      stopSimulation();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl bg-danger/10 border border-danger/30 px-3 py-2.5 text-sm font-bold text-danger transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    {t.stopSimulation}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      startSimulation();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-3 py-2.5 text-sm font-bold text-accent transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    {t.startSimulation}
                  </button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="h-px w-full bg-border"
              />

              {isAdmin ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                  className="flex flex-col gap-2 px-1"
                >
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Status</span>
                    <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-accent border border-border">
                      {t.adminBadge}
                    </span>
                  </div>
                  {showGlobalEdit && (
                    <button
                      onClick={() => {
                        toggleGlobalEdit();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                        state.globalAllowSelfEdit 
                          ? 'bg-danger/10 text-danger hover:bg-danger/20' 
                          : 'bg-accent/10 text-accent hover:bg-accent/20'
                      }`}
                    >
                      {state.globalAllowSelfEdit ? t.blockEdit : t.allowEdit}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
                  >
                    {t.navLogout}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-bg transition-transform active:scale-95"
                  >
                    {t.navLogin}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
