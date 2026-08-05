import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string()
    .min(1, { message: 'Task title is required.' })
    .refine((val) => val.trim().length > 0, { message: 'Task title is required.' })
    .refine((val) => val.trim().length <= 100, { message: 'Task title must be 100 characters or less.' }),
  description: z.string()
    .max(500, { message: 'Description must be 500 characters or less.' })
    .optional()
    .nullable()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high.' }),
  }),
  dueDate: z.string()
    .optional()
    .nullable()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(val);
    }, {
      message: 'Due date must be a valid format (YYYY-MM-DD) with a 4-digit year.',
    })
    .refine((val) => {
      if (!val) return true;
      const year = parseInt(val.split('-')[0], 10);
      return year >= 1900 && year <= 2099;
    }, {
      message: 'Due date year must be between 1900 and 2099.',
    })
    .refine((val) => {
      if (!val) return true;
      const timestamp = Date.parse(val);
      return !isNaN(timestamp);
    }, {
      message: 'Due date must be a valid date.',
    }),
});
