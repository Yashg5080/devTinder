const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {    
                throw new Error("Weak Password");
            }
            return value;
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email");
                }
            },
            message: "Invalid Email"
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid Gender")
            }
            return value;
        },
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL")
            }
            return value;
        }
    },
    about: {
        type: String,
        default: "This is a default about"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
}); 

// Caution: Don't use arrow functions here 
// as they don't bind 'this' to the document
schema.methods.getJwt = function() {
    const user = this;

    const token = jwt.sign({_id: user
    ._id}, "RandomSecret@123", {
        expiresIn: "7d"
    });
    return token;
}

schema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const actualPassword = user.password;
    return await bcrypt.compare(passwordInputByUser, actualPassword);
}

module.exports = mongoose.model('User', schema);