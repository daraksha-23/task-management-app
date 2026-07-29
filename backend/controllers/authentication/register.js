const createHttpError = require('http-errors');
const User = require('../../models/User');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');

const register = async ({ username, email, password }) => {

  const existingUser = await User.findOne({ email: email.toLowerCase()});
  if (existingUser)   throw createHttpError(400, 'User is already registered');
  
  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = register;
