export default function Input({
  label,
  error,
  required,
  charLimit,
  value,
  className = '',
  id,
  type = 'text',
  ref,
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;

  const inputProps = { ...props };
  if (value !== undefined) {
    inputProps.value = value;
  }

  return (
    <div className="space-y-1.5">
      {(label || charLimit) && (
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          {charLimit !== undefined && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {String(value ?? '').length}/{charLimit}
            </span>
          )}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        className={`block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
          } ${className}`}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

