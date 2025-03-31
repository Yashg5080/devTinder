const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();
const port = 3000;

// This middleware will help us parse the request body of incoming requests
app.use(express.json());

// This middleware will help us parse the cookies in the incoming requests
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'https://dev-tinder-ui-sandy.vercel.app'], // Add your frontend's domain here
  credentials: true, // Allow cookies and credentials
}));

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);



connectDB().then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error(err);
});