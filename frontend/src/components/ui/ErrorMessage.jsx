import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ type, message, onAction }) {
  if (type === 'corrupted') {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-red-900">
            Corrupted Task Data Detected
          </h2>
          <p className="mt-2 text-sm text-red-700 leading-relaxed">
            The task manager data stored in your browser contains invalid records or is corrupted. 
            To prevent system failures, operations have been locked.
          </p>
          <div className="mt-6 rounded-lg bg-red-100/50 p-3 text-left text-xs font-mono text-red-800 border border-red-200">
            {message || 'Error: Storage JSON fails structural schema validation rules.'}
          </div>
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset and Wipes Local Data</span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback inline error banner for write warnings (e.g. QuotaExceededError)
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5" role="alert">
      <div className="flex space-x-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
        <div>
          <h3 className="text-sm font-semibold text-amber-800">
            Storage Save Warning
          </h3>
          <p className="mt-1 text-xs text-amber-700">
            {message || 'Changes are saved in your current session, but local persistence is full or restricted by browser settings.'}
          </p>
        </div>
      </div>
    </div>
  );
}
