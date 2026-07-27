import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, LogOut, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

export default function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Brand Logo and Title */}
        <div 
          className="flex cursor-pointer items-center space-x-2 text-indigo-600 dark:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          tabIndex={0}
          onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              isAuthenticated ? navigate('/dashboard') : navigate('/login');
            }
          }}
          aria-label="Task Manager Home"
        >
          <CheckSquare className="h-6 sm:h-7 w-6 sm:w-7" />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            TaskManager
          </span>
        </div>

        {/* Action Controls (Theme toggle & Logout) */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button (Always visible) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px] min-w-[44px]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Mock Logout Trigger */}
          {isAuthenticated && location.pathname !== '/login' && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px]"
              aria-label="Log out of task manager"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
