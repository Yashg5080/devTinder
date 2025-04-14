const mongoose = require("mongoose");

let isConnected = false; // Track the connection state globally

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  const connectionString = process.env.MONGO_URI;
  if (!connectionString) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    const db = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
