const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://dev-tinder-ui-sandy.vercel.app"],
    credentials: true,
  })
);

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// Connect DB (optional: you can move this to api/index.js for more control)
connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

// ❗️No app.listen() here
module.exports = app;
