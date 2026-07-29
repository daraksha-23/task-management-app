import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ variant = 'error', title, message, onClose, className = '' }) {
  if (!message && !title) return null;

  const variantStyles = {
    error: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      border: 'border-red-200 dark:border-red-900/60',
      text: 'text-red-800 dark:text-red-300',
      iconText: 'text-red-500 dark:text-red-400',
      Icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      iconText: 'text-emerald-500 dark:text-emerald-400',
      Icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/60',
      text: 'text-amber-800 dark:text-amber-300',
      iconText: 'text-amber-500 dark:text-amber-400',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-900/60',
      text: 'text-blue-800 dark:text-blue-300',
      iconText: 'text-blue-500 dark:text-blue-400',
      Icon: Info,
    },
  };

  const style = variantStyles[variant] || variantStyles.error;
  const IconComponent = style.Icon;

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-all ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      <IconComponent className={`h-5 w-5 shrink-0 mt-0.5 ${style.iconText}`} />
      
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div>{message}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 transition opacity-70 hover:opacity-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
