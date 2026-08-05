import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please provide a valid email format.' }),
  password: z.string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export const registerSchema = z.object({
  username: z.string()
    .min(1, { message: 'Username is required.' })
    .refine((val) => val.trim().length >= 3, {
      message: 'Username must be at least 3 characters.',
    }),
  email: z.string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please provide a valid email format.' }),
  password: z.string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please provide a valid email format (e.g. name@domain.com).' }),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, { message: 'Current password is required.' }),
  newPassword: z.string()
    .min(1, { message: 'New password is required.' })
    .min(6, { message: 'New password must be at least 6 characters.' }),
  confirmPassword: z.string(),
})
.refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password cannot be the same as current password.',
  path: ['newPassword'],
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});
