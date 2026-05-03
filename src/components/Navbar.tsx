'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import ThemeToggle from './ThemeToggle';
import LangToggle from './LangToggle';

export default function Navbar() {
  const { t } = useLocale();
  const { isAdmin, logout } = useAuth();
  const { state, toggleGlobalEdit } = useStore();
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
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-4 pb-2">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text hover:bg-surface-2'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="h-px w-full bg-border"></div>

          {isAdmin ? (
            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted">Status</span>
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
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
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
                className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center rounded-xl bg-accent px-4 py-2 text-sm font-bold text-bg transition-transform active:scale-95"
            >
              {t.navLogin}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
