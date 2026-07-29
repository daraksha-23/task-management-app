const createHttpError = require('http-errors');
const Task = require('../../models/Task');

async function updateTaskStatus({ userId, taskId, status }) {
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
    },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) throw createHttpError(404, 'Task not found');
  return task;
}

module.exports = updateTaskStatus;