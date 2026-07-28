const crypto = require('crypto');
const User = require('../../models/User');
const createHttpError = require('http-errors');

const resetPassword = async ({ token, password }) => {

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)  throw createHttpError(400, 'Invalid or expired reset token');
 


  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  return { message: 'Password reset successfully' };
};

module.exports = resetPassword;
