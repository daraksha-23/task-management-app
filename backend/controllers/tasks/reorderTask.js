const createHttpError = require('http-errors');
const Task = require('../../models/Task');

async function reorderTasks({ userId, taskIds }) {
  const matchingTasks = await Task.countDocuments({
    _id: { $in: taskIds },
    user: userId,
  });

  if (matchingTasks !== taskIds.length) throw createHttpError(400,'One or more tasks are invalid or do not belong to this user');

const totalTasks = await Task.countDocuments({ user: userId,});

if (totalTasks !== taskIds.length) throw createHttpError(400,'All task IDs must be provided');

  const operations = taskIds.map((taskId, order) => ({
    updateOne: {
      filter: {
        _id: taskId,
        user: userId,
      },
      update: { order },
    },
  }));

  await Task.bulkWrite(operations);

  return Task.find({ user: userId })
    .sort({ order: 1 })
    .lean();
}

module.exports = reorderTasks;