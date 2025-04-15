const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validations");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Getting the JWT token using the getJwt method
    const token = user.getJwt();

    // Add the token to the cookie and send it back to the user
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none", // Allow cross-origin cookies
    });

    res.json({
      message: "Logged in successfully",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        photoUrl: user.photoUrl,
        about: user.about,
        skills: user.skills,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Getting the JWT token using the getJwt method
    const token = user.getJwt();

    // Add the token to the cookie and send it back to the user
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none", // Allow cross-origin cookies
    });

    await user.save();

    res.status(200).json({
      message: "User registered successfully",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    } else {
      res.status(500).json({
        message: err.message,
      });
    }
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Alternat way of doing this
    // res.cookie('token', null, {
    //     expires: new Date(Date.now())
    // });
    res.clearCookie("token");
    res.send("Logged out successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/forgetPassword", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    if (currentPassword === newPassword) {
      throw new Error("New password cannot be same as old password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Weak password");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
