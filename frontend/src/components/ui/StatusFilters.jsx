import React from 'react';

export default function StatusFilters({ activeFilter, onFilterChange, counts = { all: 0, pending: 0, completed: 0 } }) {
  const filters = [
    { key: 'All', label: 'All', count: counts.all },
    { key: 'Pending', label: 'Pending', count: counts.pending },
    { key: 'Completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter tasks by status">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter.key)}
            className={`inline-flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px] ${
              isActive
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                : 'bg-white border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>{filter.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.25 text-[10px] transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-slate-100 dark:bg-slate-200 dark:text-slate-800' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
