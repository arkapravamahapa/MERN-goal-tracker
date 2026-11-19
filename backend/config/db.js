const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('[FocusFlow] MONGO_URI not set — running with in-memory data store');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[FocusFlow] MongoDB unavailable (${error.message}) — running with in-memory data store`);
  }
};

module.exports = connectDB;