const Task = require('../../models/Task');

async function createTask({ userId, taskData }) {
  const highestTask = await Task.findOne({ user: userId })
    .sort({ order: -1 })
    .select('order')
    .lean();

  const order = highestTask ? highestTask.order + 1 : 0;

  return Task.create({
    ...taskData,
    user: userId,
    order,
  });
}

module.exports = createTask;