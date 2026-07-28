const User = require('../../models/User');
const createHttpError = require('http-errors');

const logout = async ({ userId }) => {
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
  return { message: 'Logged out successfully' };
};

module.exports = logout;
