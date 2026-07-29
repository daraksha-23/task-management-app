import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import { Loader2, KeyRound } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setApiError('');
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    setSuccessMsg('');

    const newErrors = {};
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters.';
    } else if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password cannot be the same as current password.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await changePassword(currentPassword, newPassword);
      setSuccessMsg(res.message || 'Password changed successfully!');
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Alert variant="error" message={apiError} onClose={() => setApiError('')} />
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Current Password */}
            <div className="space-y-1.5">
              <label htmlFor="modal-current-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                id="modal-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? "current-pass-error" : undefined}
              />
              {errors.currentPassword && (
                <p id="current-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.currentPassword}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "new-pass-error" : undefined}
              />
              {errors.newPassword && (
                <p id="new-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.newPassword}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-pass-error" : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirm-pass-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {errors.confirmPassword}
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
