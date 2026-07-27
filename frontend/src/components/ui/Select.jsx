export default function Select({
  label,
  error,
  required,
  className = '',
  id,
  children,
  ref,
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
        } ${className}`}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
