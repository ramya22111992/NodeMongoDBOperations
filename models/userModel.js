const mongoose = require('mongoose');
const toDo = require('./todoModel');

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: [true, "FirstName is required"],
            validate: {
                validator: function (v) {
                    return /^([a-zA-Z+\s])*[a-zA-Z]+$/.test(v);
                },
                message: props => `FirstName must contain only alphabets.${props.value} contains characters which are not alphabets `
            }
        },
        lastName: {
            type: String,
            required: [true, "LastName is required"],
            validate: {
                validator: function (v) {
                    return /^([a-zA-Z+\s])*[a-zA-Z]+$/.test(v);
                },
                message: props => `LastName must contain only alphabets.${props.value} does not contain only alphabets `
            }

        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: props => `${props.value} is not a valid email id`
        }

    },
    address: {
        street: { type: String, required: [true, "Street is required"], },
        suite: { type: String, required: [true, "Suite is required"], },
        city: { type: String, required: [true, "City is required"], },
        zipcode: {
            type: Number,
            required: [true, "ZipCode is required"],
            minLength: [6, "ZipCode must contain 6 digits"],
            maxLength: [6, "ZipCode can contain max 6 digits"],
        },
        geo: {
            lat: { type: String },
            lng: { type: String }
        },
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"],
        minLength: [10, "Phone must contain 10 digits"],
        maxLength: [10, "Phone can contain max 10 digits"],
    },
    website: {
        type: String
    },
    company: {
        name: { type: String },
        catchPhrase: { type: String },
        bs: { type: String }
    },
    todos: [toDo.todoSchema], //embedding into schema as a subdocument because its One to few relationship
    posts: [{
        //One to many relationship. 1 user can have many posts.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]

},
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema);