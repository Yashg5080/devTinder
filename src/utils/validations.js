const validator = require('validator');

const validateSignUpData = (req) => {
    const {email, password, firstName, lastName} = req.body
    if (!email || !password || !firstName || !lastName) {
        throw new Error('Missing required fields')
    }
    if (firstName.length < 2 || firstName.length > 100) {
        throw new Error('Invalid First Name')
    }
    if (lastName.length < 2 || lastName.length > 100) {
        throw new Error( 'Invalid Last Name')
    }
    if (!validator.isEmail(email)) {
        throw new Error('Invalid Email')
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error('Weak Password')
    }
}

const validateEditProfileData = (req) => {
    const allowedUpdated = new Set(['photoUrl', 'gender', 'age', 'about', "skills","firstName","lastName"]);
    const isUpdateAllowed = Object.keys(req.body).every((update) =>
         allowedUpdated.has(update));

    if (!isUpdateAllowed) {
        throw new Error('Invalid field for update')
    }
    if (req.body.age && (req.body.age < 18 || req.body.age > 100)) {
        throw new Error('Invalid age')
    }
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
};