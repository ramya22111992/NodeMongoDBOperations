const mongoose = require('mongoose');
const validator=require('../db');


const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        //postId is required to get all the comments for a post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    name: {
        type: String,
        required: [true, "Name field is missing"]
    },
    email: {
        type: String,
        required: [true, "Email field is missing"],
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: props => `${props.value} is not a valid email id`
        }
    },
    body: {
        type: String,
        required: [true, "Body field is missing"]
    }

},
    {
        timestamps: true
    })
commentSchema.plugin(validator.validatorPlugin);
exports.commentModel = mongoose.model('Comment', commentSchema);
exports.commentSchema = commentSchema;
