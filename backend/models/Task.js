// need to make changes before making apis 
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
            maxlength: 150,
            lowercase: true
        },

        description: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 2000,
            default: ''
        },

        status: {
            type: String,
            enum: Object.values(taskConstants.status),
            default: taskConstants.status.PENDING,
        },

        priority: {
            type: String,
            enum: Object.values(taskConstants.priority),
            default: taskConstants.priority.MEDIUM,
        },
        dueDate: {
            type: Date,
            trim: true,
            default: null
        },
        order: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            min:0
        }

    },
    { timestamps: true }
)


module.exports = mongoose.model('Task', TaskSchema);



