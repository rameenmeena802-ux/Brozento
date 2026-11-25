
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

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
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
