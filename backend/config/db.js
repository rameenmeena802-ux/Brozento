const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

const connectDB = async () => {
  try {
    if (cached.conn && mongoose.connection.readyState === 1) {
      return cached.conn;
    }

    const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;

    console.log('MongoDB Connected:', mongoose.connection.host);

    return cached.conn;

  } catch (error) {
    cached.promise = null;
    cached.conn = null;

    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;