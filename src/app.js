const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/database');
const User = require('./models/user');

// This middleware will help us parse the request body of incoming requests
app.use(express.json());

app.post('/signup', (req, res) => {
  const user = new User(req.body);
  try {
    user.save();
    res.send('sign up done');
  } catch (err) {
    res.send(err);
  }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({email: req.body.email});
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/user', async (req, res) => {
  try {
    const user = await User
      .findByIdAndDelete({_id: req.body.userId});
    if (!user) {
      res.status(404).send('No user found');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      {_id: req.body.userId},
      req.body,
      {returnDocument: 'after'}
    );
    if (!user) {
      res.status(404).send('No user found');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
})


connectDB().then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error(err);
});