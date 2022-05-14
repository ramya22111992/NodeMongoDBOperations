const mongoose = require('mongoose');
const validator=require('../db');


const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, "Title of the post is required"]
    },
    body: {
        type: String,
        required: [true, "Title content is required"]
    },
    /*
    One to many relationship. Go for referencing
comments field will contain an array of ObjectId's from the Comments collection.
    */
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},
    {
        timestamps: true
    })
postSchema.plugin(validator.validatorPlugin);
exports.postModel = mongoose.model('Post', postSchema);
exports.postSchema = postSchema;
