import api from './api';

export async function getTasks(params = {}) {
  const response = await api.get('/tasks', { params });
  return response.data.data;
}

export async function createTask(taskData) {
  const response = await api.post('/tasks', taskData);
  return response.data.data.task;
}

export async function updateTask(taskId, taskData) {
  const response = await api.patch(`/tasks/${taskId}`, taskData);
  return response.data.data.task;
}

export async function updateTaskStatus(taskId, status) {
  const response = await api.patch(`/tasks/${taskId}/status`, {
    status,
  });

  return response.data.data.task;
}

export async function deleteTask(taskId) {
  await api.delete(`/tasks/${taskId}`);
}

export async function reorderTasks(taskIds) {
  const response = await api.patch('/tasks/reorder', {
    taskIds,
  });

  return response.data.data.tasks;
}