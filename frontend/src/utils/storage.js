const TASK_STORAGE_PREFIX = 'task_manager_tasks';

function getStorageKey(userId) {
  if (!userId) {
    throw new Error('A user ID is required for task storage');
  }

  return `${TASK_STORAGE_PREFIX}:${userId}`;
}

export function loadTasksFromStorage(userId) {
  try {
    const storedTasks = localStorage.getItem(getStorageKey(userId));

    if (!storedTasks) {
      return [];
    }

    const tasks = JSON.parse(storedTasks);

    return Array.isArray(tasks)
      ? tasks.sort((first, second) => first.order - second.order)
      : [];
  } catch {
    return [];
  }
}

export function saveTasksToStorage(userId, tasks) {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(tasks)
  );
}

export function clearTasksStorage(userId) {
  localStorage.removeItem(getStorageKey(userId));
}