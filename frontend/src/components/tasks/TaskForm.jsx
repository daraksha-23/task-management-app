import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../../schemas/task';
import { getApiError } from '../../services/api';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export default function TaskForm({ initialData = {}, onSubmit, onCancel, submitButtonLabel = 'Save Task' }) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    mode: 'onTouched',
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      priority: (initialData.priority || 'medium').toLowerCase(),
      dueDate: initialData.dueDate || '',
    },
  });

  // Ensure TaskForm resets when async edit data changes
  useEffect(() => {
    reset({
      title: initialData.title || '',
      description: initialData.description || '',
      priority: (initialData.priority || 'medium').toLowerCase(),
      dueDate: initialData.dueDate || '',
    });
  }, [initialData, reset]);

  const titleValue = watch('title');
  const descriptionValue = watch('description');

  const onSubmitForm = async (data) => {
    try {
      await onSubmit({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || null,
      });
    } catch (err) {
      const apiError = getApiError(err);
      setError('root.server', { message: apiError.message || 'An error occurred while saving the task.' });
      if (apiError.errors) {
        Object.keys(apiError.errors).forEach((key) => {
          setError(key, { type: 'server', message: apiError.errors[key] });
        });
      }
    }
  };

  const serverError = errors.root?.server?.message;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6" noValidate>
      {serverError && (
        <Alert variant="error" message={serverError} onClose={() => clearErrors('root.server')} />
      )}

      {/* Title Input field */}
      <Input
        label="Title"
        required
        charLimit={100}
        type="text"
        id="title"
        placeholder="What needs to be done?"
        maxLength={120} // Slightly larger than validation limit to let validator trigger
        error={errors.title?.message}
        value={titleValue}
        {...register('title')}
      />

      {/* Description input field */}
      <TextArea
        label="Description"
        charLimit={500}
        id="description"
        rows={4}
        placeholder="Add optional notes, references, or links..."
        maxLength={550} // Slightly larger to let validator catch overflow
        error={errors.description?.message}
        value={descriptionValue}
        {...register('description')}
      />

      {/* Priority and Due Date Selection Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Priority Selector */}
        <Select
          label="Priority"
          id="priority"
          error={errors.priority?.message}
          {...register('priority')}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        {/* Due Date Picker */}
        <Input
          label="Due Date (Optional)"
          type="date"
          id="dueDate"
          min="1900-01-01"
          max="2099-12-31"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      {/* Form Action Controls */}
      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitButtonLabel}
        </Button>
      </div>
    </form>
  );
}



