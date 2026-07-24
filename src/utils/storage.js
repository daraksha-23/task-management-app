import { validateTaskSchema } from './taskValidation';

const STORAGE_KEY = 'task_manager_tasks';

/**
 * Reads tasks from localStorage and runs schema validation on each task.
 * Returns { tasks: Array, error: string | null }
 */
export function loadTasksFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData === null) {
      // Storage is clean, start with empty list
      return { tasks: [], error: null };
    }

    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      return { tasks: [], error: 'CORRUPTED' };
    }

    // Validate schema of every individual task
    for (const task of parsedData) {
      if (!validateTaskSchema(task)) {
        return { tasks: [], error: 'CORRUPTED' };
      }
    }

    // Return successfully validated and order-sorted task list
    const sortedTasks = [...parsedData].sort((a, b) => a.order - b.order);
    return { tasks: sortedTasks, error: null };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return { tasks: [], error: 'CORRUPTED' };
  }
}

/**
 * Saves tasks to localStorage.
 * Throws an error on failure (e.g. QuotaExceededError).
 */
export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
    throw err;
  }
}

/**
 * Explicitly clears tasks in localStorage to recover from corruption.
 */
export function clearTasksStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
    return false;
  }
}
