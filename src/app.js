const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const {validateSignUpData} = require('./utils/validations');
const {userAuth} = require('./middlewares/auth');

const app = express();
const port = 3000;

// This middleware will help us parse the request body of incoming requests
app.use(express.json());

// This middleware will help us parse the cookies in the incoming requests
app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if (!user) {
      throw new Error("Invalid credentials")
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Getting the JWT token using the getJwt method
    const token = user.getJwt();

    // Add the token to the cookie and send it back to the user
    res.cookie("token", token);
    
    res.send("Login successful");
  }
  catch (err) {
    res.status(400).send(err.message);
  }
}); 
    

app.post('/signup', async (req, res) => {
  try {
    // Validate the incoming request body
    validateSignUpData(req);

    // Hash the password before saving it to the database
    const {firstName, lastName, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();
    res.send('sign up done');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile",userAuth, async (req, res) => {
  try {

    const user = req.user;
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.get("/sendConnectionRequest",userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user.firstName + " sent a connection request");
  } catch (err) {
    res.status(400).send(err.message);
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