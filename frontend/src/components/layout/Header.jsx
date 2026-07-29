import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, Sun, Moon, User, KeyRound, ChevronDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../auth/ChangePasswordModal';

export default function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
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

          {/* Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile & User Controls */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User Profile Options"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs">
                    {user?.username ? user.username.charAt(0) : <User className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
                    {user?.username || 'Profile'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-lg z-50 transition-all">
                    {/* User Info Header */}
                    <div className="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5 mb-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Change Password Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsChangePassOpen(true);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Change Password</span>
                    </button>

                    {/* Logout Option */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {isAuthenticated && (
        <ChangePasswordModal
          isOpen={isChangePassOpen}
          onClose={() => setIsChangePassOpen(false)}
        />
      )}
    </>
  );
}
