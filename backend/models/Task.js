const mongoose = require('mongoose');
const taskConstants = require('../constants/task.constants.js')
const TaskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters']
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            default: ''
        },

        status: {
            type: String,
            enum: Object.values(taskConstants.TASK_STATUS),
            default: taskConstants.TASK_STATUS.PENDING,
        },

        priority: {
            type: String,
            enum: Object.values(taskConstants.TASK_PRIORITY),
            default: taskConstants.TASK_PRIORITY.MEDIUM,
        },
        dueDate: {
            type: Date,
            default: null
        },
        order: {
            type: Number,
            default: 0,
            min:0
        }

    },
    { timestamps: true }
)

TaskSchema.index({ user: 1, order: 1 });
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Task', TaskSchema);



