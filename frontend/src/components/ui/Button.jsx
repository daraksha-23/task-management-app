export default function Button({ 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  children, 
  ref,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:ring-2 focus-visible:outline-none min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600',
    secondary: 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600',
  };

  const combinedClassName = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button
      ref={ref}
      type={type}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
