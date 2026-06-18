const mongoose = require('mongoose');

/**
 * Connects to MongoDB, which is the required primary database for this application.
 * If in production, it strictly requires process.env.MONGO_URI and exits on failure.
 * If in development, it falls back to the in-memory mock database proxy only if MONGO_URI is unset.
 */
const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(`NODE_ENV=${nodeEnv}`);

  if (isProduction) {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is missing");
      process.exit(1);
      return;
    }

    // Mask connection credentials for safe startup logging
    let maskedUri = 'unknown source';
    try {
      const urlObj = new URL(process.env.MONGO_URI);
      if (urlObj.username) urlObj.username = '***';
      if (urlObj.password) urlObj.password = '***';
      maskedUri = urlObj.toString();
    } catch (e) {
      maskedUri = process.env.MONGO_URI.replace(/(\/\/)(.*):(.*)(@)/, '$1***:***$4');
    }

    console.log("Using MongoDB Atlas connection");
    console.log(`Connection Source: ${maskedUri}`);
    console.log("Connecting to cluster...");

    try {
      // Connect to Atlas
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // 5 seconds timeout
      });
      console.log("MongoDB Connected");
      global.useMockDb = false;
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Development mode
    const connUri = process.env.MONGO_URI;
    if (!connUri) {
      console.warn(`\n⚠️  MONGO_URI is not set. Falling back to in-memory database proxy (development convenience only).\n`);
      global.useMockDb = true;
      return;
    }

    let maskedUri = connUri.replace(/(\/\/)(.*):(.*)(@)/, '$1***:***$4');
    console.log("Using MongoDB Atlas connection (development)");
    console.log(`Connection Source: ${maskedUri}`);
    console.log("Connecting to cluster...");

    try {
      await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log("MongoDB Connected");
      global.useMockDb = false;
    } catch (error) {
      console.warn(`\n⚠️  MongoDB Connection Refused: ${error.message}`);
      console.warn(`⚠️  Primary database MongoDB is unavailable. Falling back to in-memory database proxy (development convenience only).\n`);
      global.useMockDb = true;
    }
  }
};

module.exports = connectDB;
