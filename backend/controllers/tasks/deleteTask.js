const createHttpError = require('http-errors');
const Task = require('../../models/Task');

async function deleteTask({ userId, taskId }) {
  const task = await Task.findOneAndDelete({ _id: taskId,user: userId,});

  if (!task) throw createHttpError(404, 'Task not found');

  await Task.updateMany(
    {
      user: userId,
      order: { $gt: task.order },
    },
    {
      $inc: { order: -1 },
    }
  );

  return task;
}

module.exports = deleteTask;