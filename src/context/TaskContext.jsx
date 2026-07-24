import React, { createContext, useState, useEffect } from 'react';
import { loadTasksFromStorage, saveTasksToStorage, clearTasksStorage } from '../utils/storage';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  // Synchronous lazy initializer avoids writing empty state to localStorage
  const [state, setState] = useState(() => {
    const { tasks, error } = loadTasksFromStorage();
    return {
      tasks,
      loading: false,
      storageError: error,
    };
  });

  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'warning', text: string }
  const [writeWarning, setWriteWarning] = useState(false); // Triggers warning alert if storage writing fails

  // Auto-dismiss user feedback notifications after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Helper to show user feedback message
  const showFeedback = (type, text) => {
    setFeedback({ type, text });
  };

  // Safe wrapper for persisting updates to storage
  const saveTasks = (newTasks) => {
    if (state.storageError === 'CORRUPTED') {
      // Abort writes to prevent silently overwriting user's corrupted state before reset
      return;
    }
    try {
      saveTasksToStorage(newTasks);
      setWriteWarning(false);
    } catch (err) {
      console.error('Failed to write tasks to storage:', err);
      setWriteWarning(true);
      showFeedback('warning', 'Changes saved to session only. Persistent storage full or restricted.');
    }
  };

  // Action: Add new task
  const addTask = (title, description, priority, dueDate = null) => {
    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const newTask = {
      id,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority,
      dueDate: dueDate || null,
      order: state.tasks.length, // Appended to end of list
    };

    const updatedTasks = [...state.tasks, newTask];
    setState((prev) => ({ ...prev, tasks: updatedTasks }));
    saveTasks(updatedTasks);
    showFeedback('success', `Task "${newTask.title}" created successfully.`);
  };

  // Action: Update existing task details
  const updateTask = (id, updatedFields) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          ...updatedFields,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    setState((prev) => ({ ...prev, tasks: updatedTasks }));
    saveTasks(updatedTasks);
    showFeedback('success', 'Task updated successfully.');
  };

  // Action: Delete task and re-sequence order coordinates
  const deleteTask = (id) => {
    const targetTask = state.tasks.find((t) => t.id === id);
    const titleText = targetTask ? `"${targetTask.title}"` : 'Task';

    const filteredTasks = state.tasks.filter((task) => task.id !== id);
    // Re-sequence remaining tasks order from 0 to N-1
    const resequencedTasks = filteredTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setState((prev) => ({ ...prev, tasks: resequencedTasks }));
    saveTasks(resequencedTasks);
    showFeedback('success', `${titleText} deleted successfully.`);
  };

  // Action: Toggle Completed / Pending status
  const toggleTaskStatus = (id) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    setState((prev) => ({ ...prev, tasks: updatedTasks }));
    saveTasks(updatedTasks);
    showFeedback('success', 'Task status updated.');
  };

  // Action: Reorder tasks (active in Bonus phase)
  const reorderTasks = (startIndex, endIndex) => {
    const result = Array.from(state.tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Reset order properties to reflect new index placement
    const resequencedTasks = result.map((task, index) => ({
      ...task,
      order: index,
    }));

    setState((prev) => ({ ...prev, tasks: resequencedTasks }));
    saveTasks(resequencedTasks);
    showFeedback('success', 'Task order updated.');
  };

  // Action: Recover and clear storage on corruption
  const resetStorage = () => {
    clearTasksStorage();
    setState({
      tasks: [],
      loading: false,
      storageError: null,
    });
    setWriteWarning(false);
    showFeedback('success', 'Storage cleared. App reset to empty list.');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        storageError: state.storageError,
        feedback,
        writeWarning,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        reorderTasks,
        resetStorage,
        clearFeedback: () => setFeedback(null),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
