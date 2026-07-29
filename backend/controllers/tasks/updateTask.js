const createHttpError = require('http-errors');
const Task = require('../../models/Task');

async function updateTask({ userId, taskId, updates }) {
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
    },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task)  throw createHttpError(404, 'Task not found');
  return task;
}

module.exports = updateTask;