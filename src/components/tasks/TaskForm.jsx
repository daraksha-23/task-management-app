import React, { useState } from 'react';
import { validateTask } from '../../utils/taskValidation';

export default function TaskForm({ initialData = {}, onSubmit, onCancel, submitButtonLabel = 'Save Task' }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [priority, setPriority] = useState(initialData.priority || 'Medium');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
    };

    // Use our validation utility
    const { isValid, errors: validationErrors } = validateTask(taskData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Title Input field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Title <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {title.length}/100
          </span>
        </div>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={120} // Slightly larger than validation limit to let validator trigger
          className={`block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
            errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
          }`}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description input field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Description
          </label>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {description.length}/500
          </span>
        </div>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add optional notes, references, or links..."
          maxLength={550} // Slightly larger to let validator catch overflow
          className={`block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
            errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
          }`}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {/* Priority and Due Date Selection Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Priority Selector */}
        <div className="space-y-1.5">
          <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
              {errors.priority}
            </p>
          )}
        </div>

        {/* Due Date Picker */}
        <div className="space-y-1.5">
          <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Due Date (Optional)
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            min="1900-01-01"
            max="2099-12-31"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
              errors.dueDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
            }`}
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
          />
          {errors.dueDate && (
            <p id="dueDate-error" className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none min-h-[44px]"
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  );
}
