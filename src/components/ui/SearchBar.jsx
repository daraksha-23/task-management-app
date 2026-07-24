import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks by title or description..."
        className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-10 text-sm shadow-sm transition placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        aria-label="Search tasks"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus-visible:outline-indigo-500 rounded-md min-h-[44px]"
          aria-label="Clear search input"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
