const User = require('../../models/User');
const createHttpError = require('http-errors');

const changePassword = async ({ currentPassword, newPassword, userId }) => {
  const user = await User.findById(userId).select('+password');
  if (!user)  throw createHttpError(404, 'User not found');


  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw createHttpError(400, 'Invalid current password');


  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

module.exports = changePassword;
