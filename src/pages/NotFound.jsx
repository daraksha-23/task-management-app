import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <HelpCircle className="h-16 w-16 text-slate-400 mb-4 animate-bounce" />
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-md">
        The page you are looking for doesn't exist, or has been moved to a new destination.
      </p>
      <div className="mt-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
