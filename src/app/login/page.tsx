'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      router.push('/');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl"
      >
        <div className="bg-gradient-to-br from-accent to-accent-2 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <h1 className="relative text-2xl font-black text-bg">{t.loginTitle}</h1>
          <p className="relative mt-2 text-sm font-medium text-bg/80">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-5">
            <div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder={t.username}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-surface-2 py-3.5 pl-11 pr-4 text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type="password"
                  required
                  dir="ltr"
                  placeholder={t.password}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-surface-2 py-3.5 pl-11 pr-4 text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-danger text-center">
              {t.loginError}
            </motion.p>
          )}

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_var(--color-accent-glow)]"
          >
            {t.loginBtn}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          </button>
          
          <div className="mt-6 text-center">
            <span className="text-xs font-semibold text-text-muted tracking-widest uppercase">{t.secured}</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
