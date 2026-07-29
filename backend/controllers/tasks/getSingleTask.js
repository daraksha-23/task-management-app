const createHttpError = require('http-errors');
const Task = require('../../models/Task');

async function getTask({ userId, taskId }) {
  const task = await Task.findOne({ _id: taskId, user: userId,}).lean();
  if (!task) throw createHttpError(404, 'Task not found');
  return task;
}

module.exports = getTask;