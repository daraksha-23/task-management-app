const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const taskRoutes = require('./tasks')


router.use('/auth',authRoutes );
// router.use('/user',userRoutes);
router.use('/tasks',taskRoutes );


module.exports = router;
