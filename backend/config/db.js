const mongoose = require('mongoose');

/**
 * Connects to MongoDB, which is the required primary database for this application.
 * If MongoDB is not running locally or via a configured MONGO_URI, the app falls back
 * to an optional in-memory mock database as a zero-config development convenience.
 */
const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/casual_analytics';
    // Set a short timeout (2s) for local discovery so the server starts quickly
    const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.warn(`\n⚠️  MongoDB Connection Refused: ${error.message}`);
    console.warn(`⚠️  Primary database MongoDB is unavailable. Falling back to in-memory database proxy (development convenience only).\n`);
    global.useMockDb = true;
  }
};

module.exports = connectDB;
