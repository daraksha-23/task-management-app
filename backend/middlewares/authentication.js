const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw createHttpError(401, 'Authentication token required');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select('_id username email isActive ');
    if (!user) throw createHttpError(404, 'User not found');
    // account status checks
    if (user.isActive === false) throw createHttpError(403, 'Your account has been deactivated');

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError')  return next(createHttpError(401, 'Token expired'));
    if (error.name === 'JsonWebTokenError')  return next(createHttpError(401, 'Invalid authentication token'));
    next(error);
  }
};
module.exports = authenticate;