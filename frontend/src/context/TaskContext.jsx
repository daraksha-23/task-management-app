import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import { getApiError } from '../services/api';
import { getTasks as fetchTasks, createTask as createTaskRequest, updateTask as updateTaskRequest, updateTaskStatus as updateTaskStatusRequest, deleteTask as deleteTaskRequest, reorderTasks as reorderTasksRequest,} from '../services/taskService';

import { loadTasksFromStorage, saveTasksToStorage, clearTasksStorage,} from '../utils/storage';

export const TaskContext = createContext(null);

function normalizeTask(task) {
  return {
    id: task._id || task.id,
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    completed: task.status === 'completed',
    dueDate: task.dueDate
      ? task.dueDate.slice(0, 10)
      : null,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function normalizeTasks(tasks) {
  return tasks
    .map(normalizeTask)
    .sort((first, second) => first.order - second.order);
}

export function TaskProvider({ children }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  const showFeedback = useCallback((type, text) => {
    setFeedback({ type, text });
  }, []);

  const saveCache = useCallback(
    (updatedTasks) => {
      if (user?.id) {
        saveTasksToStorage(user.id, updatedTasks);
      }
    },
    [user]
  );

  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const cachedTasks = loadTasksFromStorage(user.id);

    if (cachedTasks.length > 0) {
      setTasks(cachedTasks);
    }

    setLoading(true);
    setError('');

    try {
      const databaseTasks = await fetchTasks();
      const normalizedTasks = normalizeTasks(databaseTasks);

      setTasks(normalizedTasks);
      saveTasksToStorage(user.id, normalizedTasks);
    } catch (requestError) {
      const apiError = getApiError(requestError);

      setError(apiError.message);

      if (cachedTasks.length > 0) {
        showFeedback(
          'warning',
          'Showing cached tasks because the server is unavailable.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user, showFeedback]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const addTask = async (
    title,
    description,
    priority,
    dueDate = null
  ) => {
    setError('');

    try {
      const createdTask = await createTaskRequest({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      });

      const normalizedTask = normalizeTask(createdTask);

      setTasks((currentTasks) => {
        const updatedTasks = [...currentTasks, normalizedTask];
        saveCache(updatedTasks);
        return updatedTasks;
      });

      showFeedback(
        'success',
        `Task "${normalizedTask.title}" created successfully.`
      );

      return normalizedTask;
    } catch (requestError) {
      const apiError = getApiError(requestError);
      setError(apiError.message);
      throw requestError;
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    setError('');

    try {
      const updatedTask = await updateTaskRequest(
        taskId,
        updatedFields
      );

      const normalizedTask = normalizeTask(updatedTask);

      setTasks((currentTasks) => {
        const nextTasks = currentTasks.map((task) =>
          task.id === taskId ? normalizedTask : task
        );

        saveCache(nextTasks);
        return nextTasks;
      });

      showFeedback('success', 'Task updated successfully.');

      return normalizedTask;
    } catch (requestError) {
      const apiError = getApiError(requestError);
      setError(apiError.message);
      throw requestError;
    }
  };

  const deleteTask = async (taskId) => {
    setError('');

    try {
      const taskToDelete = tasks.find(
        (task) => task.id === taskId
      );

      await deleteTaskRequest(taskId);

      setTasks((currentTasks) => {
        const updatedTasks = currentTasks
          .filter((task) => task.id !== taskId)
          .map((task, order) => ({
            ...task,
            order,
          }));

        saveCache(updatedTasks);
        return updatedTasks;
      });

      showFeedback(
        'success',
        taskToDelete
          ? `Task "${taskToDelete.title}" deleted successfully.`
          : 'Task deleted successfully.'
      );
    } catch (requestError) {
      const apiError = getApiError(requestError);
      setError(apiError.message);
      throw requestError;
    }
  };

  const toggleTaskStatus = async (taskId) => {
    setError('');

    const currentTask = tasks.find( (task) => task.id === taskId );
    if (!currentTask) {return;}

    const nextStatus = currentTask.completed ? 'pending' : 'completed';

    try { const updatedTask = await updateTaskStatusRequest(taskId,nextStatus);

      const normalizedTask = normalizeTask(updatedTask);

      setTasks((currentTasks) => {
        const updatedTasks = currentTasks.map((task) =>
          task.id === taskId ? normalizedTask : task
        );

        saveCache(updatedTasks);
        return updatedTasks;
      });

      showFeedback('success', 'Task status updated.');
    } catch (requestError) {
      const apiError = getApiError(requestError);
      setError(apiError.message);
    }
  };

  const reorderTasks = async (startIndex, endIndex) => {
    if (
      startIndex === endIndex ||
      endIndex < 0 ||
      endIndex >= tasks.length
    ) {
      return;
    }

    const previousTasks = tasks;

    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(startIndex, 1);
    reorderedTasks.splice(endIndex, 0, movedTask);

    const orderedTasks = reorderedTasks.map((task, order) => ({
      ...task,
      order,
    }));

    setTasks(orderedTasks);
    saveCache(orderedTasks);

    try {
      const databaseTasks = await reorderTasksRequest(
        orderedTasks.map((task) => task.id)
      );

      const normalizedTasks = normalizeTasks(databaseTasks);

      setTasks(normalizedTasks);
      saveCache(normalizedTasks);
      showFeedback('success', 'Task order updated.');
    } catch (requestError) {
      setTasks(previousTasks);
      saveCache(previousTasks);

      const apiError = getApiError(requestError);
      setError(apiError.message);
      showFeedback('warning', 'Task order could not be updated.');
    }
  };

  const resetStorage = () => {
    if (!user?.id) {
      return;
    }

    clearTasksStorage(user.id);
    loadTasks();
  };

  const contextValue = useMemo(
    () => ({
      tasks,
      loading,
      error,
      feedback,
      storageError: null,
      writeWarning: Boolean(error),
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      reorderTasks,
      resetStorage,
      clearFeedback: () => setFeedback(null),
      reloadTasks: loadTasks,
    }),
    [tasks, loading, error, feedback, loadTasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}