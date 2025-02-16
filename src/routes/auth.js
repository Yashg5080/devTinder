const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const {validateSignUpData} = require('../utils/validations');


const router = express.Router();

router.post("/login", async (req, res) => {
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

      
  
router.post('/signup', async (req, res) => {
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

module.exports = router;