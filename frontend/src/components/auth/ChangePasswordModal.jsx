import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { changePasswordSchema } from '../../schemas/auth';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import { Loader2, KeyRound } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { changePassword } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const resetForm = () => {
    reset();
    setSuccessMsg('');
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    setSuccessMsg('');
    try {
      const res = await changePassword(data.currentPassword, data.newPassword);
      setSuccessMsg(res.message || 'Password changed successfully!');
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        Object.keys(err.errors).forEach((key) => {
          setError(key, { type: 'server', message: err.errors[key] });
        });
      }
      setError('root.server', { message: err.message || 'Failed to change password. Please verify current password.' });
    }
  };

  const apiError = errors.root?.server?.message;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span>Change Password</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Success Alert */}
        {successMsg && (
          <Alert variant="success" message={successMsg} />
        )}

        {/* API Error Alert */}
        {apiError && (
          <Alert variant="error" message={apiError} onClose={() => clearErrors('root.server')} />
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* Current Password */}
            <div className="space-y-1.5">
              <label htmlFor="modal-current-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                id="modal-current-password"
                type="password"
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? "current-pass-error" : undefined}
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p id="current-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="modal-new-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                id="modal-new-password"
                type="password"
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "new-pass-error" : undefined}
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p id="new-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label htmlFor="modal-confirm-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                id="modal-confirm-password"
                type="password"
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-pass-error" : undefined}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p id="confirm-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none disabled:opacity-50 min-w-[130px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
