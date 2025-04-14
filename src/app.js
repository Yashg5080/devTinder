const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json({ limit: "1mb" })); // Set a limit for the request body size
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://dev-tinder-ui-sandy.vercel.app"],
    credentials: true,
  })
);

// Test route
app.get("/", (req, res, next) => {
  console.log("Auth Middleware");
  res.send("Auth Middleware");
  next();
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/request", require("./routes/request"));
app.use("/user", require("./routes/user"));

// Connect to MongoDB
connectDB();

module.exports = app;
