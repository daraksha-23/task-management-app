const express = require('express');
const router = express.Router();
const authValidator = require('../utils/authValidator.js');
const validate = require('../middlewares/validation.js');
const authenticate = require('../middlewares/authentication.js');


// Register Endpoint
router.post('/register', validate(authValidator.registerUserValidator), async function _register(req, res, next) {
  try {
    const data = await require('../controllers/authentication/register.js')(req.body);
    return res.status(201).json({
      success: true,
      status: 201,
      statusText: 'Created',
      message: 'User registered successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
});

// Login Endpoint
router.post('/login', validate(authValidator.loginUserValidator), async function _login(req, res, next) {
  try {
    const data = await require('../controllers/authentication/login.js')(req.body);
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: 'Request executed successfully, User logged in',
      data,
    });
  } catch (error) {
    next(error);
  }
});

// Logout Endpoint
router.post('/logout', authenticate, async function _logout(req, res, next) {
  try {
    const data = await require('../controllers/authentication/logout.js')({ userId: req.user._id });
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: data.message,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh Endpoint
router.post('/refresh', async function _refreshToken(req, res, next) {
  try {
    let token = req.body.refreshToken;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    const data = await require('../controllers/authentication/refreshToken.js')({ token });
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: 'Tokens refreshed successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
});

// Current User Profile Endpoint
router.get('/profile', authenticate, async function _profile(req, res, next)  {
  try {
    const data = await require('../controllers/authentication/profile.js')({ userId: req.user._id });
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: 'User profile retrieved successfully',
      data,
    });
  } catch(error) {
    next(error);
  }
});

// Forgot Password Endpoint
router.post('/forgot-password', validate(authValidator.forgotPasswordValidator), async (req, res, next) => {
  try {
    const data = await require('../controllers/authentication/forgotPassword.js')(req.body);
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: data.message,
    });
  } catch (error) {
    next(error);
  }
});

// Reset Password Endpoint
router.post('/reset-password/:token', validate(authValidator.resetPasswordValidator), async function _resetPassword(req, res, next) {
  try {
    const data = await require('../controllers/authentication/resetPassword.js')({
      token: req.params.token,
      password: req.body.password,
    });
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: data.message,
    });
  } catch(error) {
    next(error);
  }
});

// Change Password Endpoint
router.post('/change-password', authenticate, validate(authValidator.changePasswordValidator), async function _changePassowrd(req, res, next)  {
  try {
    const data = await require('../controllers/authentication/changePassword.js')({
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      userId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      status: 200,
      statusText: 'OK',
      message: data.message,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;