/**
 * Validates a task object fields.
 * Returns { isValid: boolean, errors: { [field]: string } }
 */
export function validateTask(taskData) {
  const errors = {};

  // Title validation
  const title = (taskData.title || '').trim();
  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length > 100) {
    errors.title = 'Task title must be 100 characters or less.';
  }

  // Description validation
  const description = taskData.description || '';
  if (description.length > 500) {
    errors.description = 'Description must be 500 characters or less.';
  }

  // Priority validation
  const priority = taskData.priority;
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!priority || !validPriorities.includes(priority)) {
    errors.priority = 'Priority must be Low, Medium, or High.';
  }

  // Due Date validation (Bonus field, optional)
  if (taskData.dueDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(taskData.dueDate)) {
      errors.dueDate = 'Due date must be a valid format (YYYY-MM-DD) with a 4-digit year.';
    } else {
      const year = parseInt(taskData.dueDate.split('-')[0], 10);
      if (year < 1900 || year > 2099) {
        errors.dueDate = 'Due date year must be between 1900 and 2099.';
      } else {
        const timestamp = Date.parse(taskData.dueDate);
        if (isNaN(timestamp)) {
          errors.dueDate = 'Due date must be a valid date.';
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a single task schema loaded from storage.
 * Ensures the data structure matches expected types and formats exactly.
 */
export function validateTaskSchema(task) {
  if (!task || typeof task !== 'object') return false;
  if (typeof task.id !== 'string' || !task.id) return false;
  if (typeof task.title !== 'string' || !task.title.trim()) return false;
  if (task.description !== undefined && typeof task.description !== 'string') return false;
  if (typeof task.completed !== 'boolean') return false;
  if (typeof task.createdAt !== 'string') return false;
  if (typeof task.updatedAt !== 'string') return false;
  if (!['Low', 'Medium', 'High'].includes(task.priority)) return false;
  if (typeof task.order !== 'number') return false;
  if (task.dueDate !== undefined && task.dueDate !== null && typeof task.dueDate !== 'string') return false;
  return true;
}

/**
 * Validates a simple email pattern.
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
