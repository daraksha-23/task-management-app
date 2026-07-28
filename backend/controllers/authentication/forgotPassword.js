const crypto = require('crypto');
const User = require('../../models/User');
const createHttpError = require('http-errors');
const sendMail = require('../../services/emailService');

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)   throw createHttpError(404, 'No user found with that email address');


  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256') .update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    TEMPLATE: 'resetPassword',
    data: {
      username: user.username,
      resetUrl,
    },
  });

  return { message: 'Password reset link sent to email' };
};

module.exports = forgotPassword;
