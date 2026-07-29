import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Loader2, CheckCircle2 } from 'lucide-react';

import Alert from '../components/ui/Alert';

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setSuccessMsg('Your password has been successfully reset.');
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md sm:p-8 transition-colors">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Choose new password
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Set your new login password below
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <Alert
            variant="success"
            title={successMsg}
            message="You can now sign in using your new credentials."
          />
        )}

        {/* API Error Box */}
        {apiError && (
          <Alert
            variant="error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        {/* Form */}
        {!successMsg && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            
            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resetting password...</span>
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
