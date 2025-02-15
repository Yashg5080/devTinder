const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const {validateSignUpData} = require('./utils/validations');

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Create a jwt token 
    const token = jwt.sign({_id: user._id}, "RandomSecret@123");

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

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({email: req.body.email});
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, "RandomSecret@123");

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
})


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

app.patch('/user/:userId', async (req, res) => {
  try {
    const userId = req.params?.userId

    // These are the custom validations for the fields that can be updated
    ALLOWED_UPDATES = new Set(['photoUrl', 'about', 'gender', 'skills']);
    const isUpdateAllowed = Object.keys(req.body).every((key) => {
      return ALLOWED_UPDATES.has(key);
    });

    if (!isUpdateAllowed) {
      return res.status(400).send('Invalid field for update');
    }

    if (req.body.skills) {
      if (!Array.isArray(req.body.skills)) {
        return res.status(400).send('Skills should be an array');
      } 
      else if (req.body.skills.some((skill) => typeof skill !== 'string')) {
        return res.status(400).send('Skills should be an array of strings');
      } 
      else if (req.body.skills.length > 5) {
         throw res.status(400).send('Skills should not be more than 5');
      }
    }

    const user = await User.findByIdAndUpdate(
      {_id: userId},
      req.body,
      {returnDocument: 'after', runValidators: true}
    );
    if (!user) {
      return res.status(404).send('No user found');
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