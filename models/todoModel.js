const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: [true, "Title field is missing"]
    },
    completed: {
        type: Boolean,
        required: [true, "Completed field is missing"]
    }
},
    {
        timestamps: true
    })

exports.todoModel = mongoose.model('ToDo', todoSchema);
exports.todoSchema = todoSchema;