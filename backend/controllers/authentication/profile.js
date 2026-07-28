const User = require('../../models/User');
const createHttpError = require('http-errors');

const profile = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user)  throw createHttpError(404, 'User not found');
  
  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

module.exports = profile;
