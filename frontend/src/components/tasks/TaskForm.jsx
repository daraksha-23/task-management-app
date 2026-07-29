import React, { useState } from 'react';
import { validateTask } from '../../utils/taskValidation';
import { getApiError } from '../../services/api';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export default function TaskForm({ initialData = {}, onSubmit, onCancel, submitButtonLabel = 'Save Task' }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');
    setErrors({});

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
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(taskData);
    } catch (err) {
      const apiError = getApiError(err);
      setServerError(apiError.message);
      if (apiError.errors) {
        setErrors(apiError.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {serverError && (
        <Alert variant="error" message={serverError} onClose={() => setServerError('')} />
      )}

      {/* Title Input field */}
      <Input
        label="Title"
        required
        charLimit={100}
        type="text"
        name="title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={120} // Slightly larger than validation limit to let validator trigger
        error={errors.title}
      />

      {/* Description input field */}
      <TextArea
        label="Description"
        charLimit={500}
        name="description"
        id="description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add optional notes, references, or links..."
        maxLength={550} // Slightly larger to let validator catch overflow
        error={errors.description}
      />

      {/* Priority and Due Date Selection Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Priority Selector */}
        <Select
          label="Priority"
          id="priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          error={errors.priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        {/* Due Date Picker */}
        <Input
          label="Due Date (Optional)"
          type="date"
          name="dueDate"
          id="dueDate"
          min="1900-01-01"
          max="2099-12-31"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
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


