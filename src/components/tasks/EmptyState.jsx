import React from 'react';
import { ClipboardList, SearchX, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ type, onClearFilters }) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center sm:p-12 transition-colors">
        <SearchX className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching tasks found</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search keywords or switching filters to find what you are looking for.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px]"
          >
            Clear Search & Filters
          </button>
        </div>
      </div>
    );
  }

  // Default empty state when no tasks exist at all
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center sm:p-12 transition-colors">
      <ClipboardList className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks created yet</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Get started by creating your very first task to track priorities and complete objectives.
      </p>
      <div className="mt-5">
        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none min-h-[44px]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create First Task</span>
        </Link>
      </div>
    </div>
  );
}
