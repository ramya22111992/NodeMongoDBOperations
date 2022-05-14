const mongoose = require('mongoose');
const validator=require('../db');

const todoSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

todoSchema.plugin(validator.validatorPlugin);
exports.todoModel = mongoose.model('ToDo', todoSchema);
exports.todoSchema = todoSchema;
