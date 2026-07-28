const express = require('express');
const router = express.Router();
const createHttpError = require('http-errors');
const authValidator = require('../utils/authValidator.js');
const authentication = require('../middlewares/authentication.js');
const userConstant = require('../constants/user.constants.js');

router.post('/login', validate(authValidator.loginUserValidator), async function _login(req, res, next) {
  try {
    const data = await require('../controllers/authentication/login.js')(requestBody);
    return res.status(200).json({
      data: data,
      status: 200,
      message: 'Request executed successfully, User logged in',
      statusText: 'OK'
    });
  } catch (error) {
    next(error);
  }
})



module.exports = router;