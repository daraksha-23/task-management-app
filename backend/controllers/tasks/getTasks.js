const Task = require('../../models/Task');

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getTasks({ userId, query = {} }) {
  const filter = { user: userId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.search) {
    const escapedSearch = escapeRegex(query.search);
    filter.$or = [
      { title: { $regex: escapedSearch, $options: 'i' } },
      { description: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 9));

  const totalTasks = await Task.countDocuments(filter);
  const totalPages = Math.ceil(totalTasks / limit) || 1;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    tasks,
    pagination: {
      page,
      limit,
      totalTasks,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

module.exports = getTasks;