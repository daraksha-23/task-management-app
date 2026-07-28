const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../../models/User');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');

const refreshToken = async ({ token }) => {
  if (!token)    throw createHttpError(400, 'Refresh token is required');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token)  throw createHttpError(401, 'Invalid refresh token session');
  
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = refreshToken;
