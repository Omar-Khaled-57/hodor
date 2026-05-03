'use client';

import { useLocale } from '@/contexts/LocaleContext';

interface StatusBadgeProps {
  present: boolean;
}

export default function StatusBadge({ present }: StatusBadgeProps) {
  const { t } = useLocale();

  if (present) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent border border-accent/20 shadow-[0_0_10px_var(--color-accent-glow)]">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {t.present}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-text-muted border border-border">
      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
      {t.absent}
    </span>
  );
}
