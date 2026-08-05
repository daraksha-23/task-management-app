import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../schemas/auth';
import { CheckSquare } from 'lucide-react';

import Alert from '../components/ui/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        Object.keys(err.errors).forEach((key) => {
          setError(key, { type: 'server', message: err.errors[key] });
        });
      }
      setError('root.server', { message: err.message || 'Login failed. Please verify your credentials.' });
    }
  };

  const apiError = errors.root?.server?.message;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md sm:p-8 transition-colors">

        {/* Sign In Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in below to access your tasks
          </p>
        </div>

        {/* API Error Box */}
        {apiError && (
          <Alert
            variant="error"
            message={apiError}
            onClose={() => clearErrors('root.server')}
          />
        )}

        {/* Form Container */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email input field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : ''
                }`}
              placeholder="you@example.com"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : ''
                }`}
              placeholder="••••••••"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Continue to Dashboard'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

