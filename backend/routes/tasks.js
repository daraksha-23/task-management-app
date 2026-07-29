const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validation.js');
const authenticate = require('../middlewares/authentication.js');
const { createTaskValidator, updateTaskValidator, updateTaskStatusValidator, taskIdParamsValidator , reorderTasksValidator} = require('../utils/taskValidator');

router.use(authenticate);

router.post('/', validate(createTaskValidator), async function _createTask(req, res, next) {
  try {
    const task = await require('../controllers/tasks/createTask.js')({
      userId: req.user._id,
      taskData: req.body,
    });
    res.status(201).json({
      success: true,
      status: 201,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}
);

router.get('/', async function _getTasks(req, res, next) {
  try {
    const tasks = await require('../controllers/tasks/getTasks.js')({ userId: req.user._id, query: req.query, });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Tasks retrieved successfully',
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validate(taskIdParamsValidator, 'params'), async function _getSingleTask(req, res, next) {
  try {
    const task = await require('../controllers/tasks/getSingleTask.js')({ userId: req.user._id, taskId: req.params.id, });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Task retrieved successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}
);


router.patch('/reorder', validate(reorderTasksValidator), async function _reorderTasks(req, res, next){
    try {
      const tasks = await require('../controllers/tasks/reorderTask.js')({
        userId: req.user._id,
        taskIds: req.body.taskIds,
      });

      res.status(200).json({
        success: true,
        status: 200,
        message: 'Tasks reordered successfully',
        data: { tasks },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.patch('/:id', validate(taskIdParamsValidator, 'params'), validate(updateTaskValidator),
  async function _updateTask(req, res, next) {
    try {
      const task = await require('../controllers/tasks/updateTask.js')({ userId: req.user._id, taskId: req.params.id, updates: req.body, });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Task updated successfully',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id/status', validate(taskIdParamsValidator, 'params'), validate(updateTaskStatusValidator), async function _updateTaskStatus(req, res, next) {
  try {
    const task = await require('../controllers/tasks/updateTaskStatus.js')({
      userId: req.user._id,
      taskId: req.params.id,
      status: req.body.status,
    });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Task status updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}
);

router.delete('/:id', validate(taskIdParamsValidator, 'params'),async function _deleteTask(req, res, next) {
    try {
      await require('../controllers/tasks/deleteTask.js')({userId: req.user._id,taskId: req.params.id,});
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;