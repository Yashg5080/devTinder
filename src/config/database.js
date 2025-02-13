const conectionString = "mongodb+srv://yash:63pddoAfPTg4EIT3@cluster0.qeohcv7.mongodb.net/"
const databaseName = "First_DB"
const mongoose = require('mongoose', {
    useCreateIndex: true,
});
const connectDB = async() => {
    await mongoose.connect(conectionString + databaseName);
}

module.exports = connectDB;
