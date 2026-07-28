const { z } = require('zod');

const registerUserValidator = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 30 characters' })
    .trim()
    .toLowerCase(),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

const loginUserValidator = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' }),
});

const forgotPasswordValidator = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please provide a valid email address' })
    .trim(),
});

const resetPasswordValidator = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

const changePasswordValidator = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' }),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, { message: 'New password must be at least 6 characters long' }),
})
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: 'New password cannot be the same as current password',
      path: ['newPassword'],
    }
  );

module.exports = {
  registerUserValidator,
  loginUserValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
};
