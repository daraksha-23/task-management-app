const Task = require('../../models/Task');

async function getTasks({ userId, query }) {
  const filter = { user: userId };

  if (query.status) filter.status = query.status;
  

  if (query.priority) filter.priority = query.priority;
 

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  return Task.find(filter).sort({ order: 1, createdAt: -1 }).lean();
}

module.exports = getTasks;