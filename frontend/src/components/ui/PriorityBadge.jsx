import React from 'react';

export default function PriorityBadge({ priority }) {
  const styles = {
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30',
    medium: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700',
  };

  const normalized = (priority || 'medium').toLowerCase();
  const currentStyle = styles[normalized] || styles.low;
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide shadow-sm ${currentStyle}`}>
      {label}
    </span>
  );
}
