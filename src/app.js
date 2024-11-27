const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/database');
const User = require('./models/user');

app.post('/signup', (req, res) => {
  const user = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'random@gmail.com',
    age: 30
  });
  try {
    user.save();
    res.send('sign up done');
  } catch (err) {
    res.send(err);
  }
});

connectDB().then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error(err);
});