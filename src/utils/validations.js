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

module.exports = {
    validateSignUpData
};