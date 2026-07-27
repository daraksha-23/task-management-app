import React from 'react';

export default function PriorityBadge({ priority }) {
  const styles = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const currentStyle = styles[priority] || styles.Low;

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide shadow-sm ${currentStyle}`}>
      {priority}
    </span>
  );
}
