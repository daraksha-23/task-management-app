const { z } = require('zod');

const { TASK_STATUS, TASK_PRIORITY, } = require('../constants/task.constants');


const objectIdValidator = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid task ID');
const taskIdParamsValidator = z.object({
    id: objectIdValidator,
}).strict();

const nullableDueDate = z.union([
    z.iso.date(),
    z.literal(''),
    z.null(),])
    .optional()
    .transform((value) => value || null);

const createTaskValidator = z.object({
    title: z
        .string({ required_error: 'Task title is required' })
        .trim()
        .min(1, 'Task title is required')
        .max(150, 'Title cannot exceed 150 characters'),

    description: z
        .string()
        .trim()
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional()
        .default(''),

    priority: z
        .enum(Object.values(TASK_PRIORITY), {
            message: 'Priority must be low, medium or high',
        })
        .optional()
        .default(TASK_PRIORITY.MEDIUM),

    dueDate: nullableDueDate,
})
    .strict();

const updateTaskValidator = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Task title is required')
        .max(150, 'Title cannot exceed 150 characters')
        .optional(),

    description: z
        .string()
        .trim()
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional(),

    priority: z
        .enum(Object.values(TASK_PRIORITY).map(value => value.toLowerCase()), {
            message: 'Priority must be low, medium or high',
        })
        .optional(),

    dueDate: nullableDueDate,
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one task field must be provided',
    });

const updateTaskStatusValidator = z.object({
    status: z.enum(Object.values(TASK_STATUS), {
        message: 'Status must be pending or completed',
    }),
})
    .strict();

const reorderTasksValidator = z.object({
    taskIds: z
        .array(objectIdValidator)
        .min(1, 'At least one task ID is required'),
})
    .strict()
    .refine(
        ({ taskIds }) => new Set(taskIds).size === taskIds.length,
        {
            message: 'Task IDs cannot contain duplicates',
            path: ['taskIds'],
        }
    );


module.exports = {
    createTaskValidator,
    updateTaskValidator,
    updateTaskStatusValidator,
    reorderTasksValidator,
    taskIdParamsValidator
};