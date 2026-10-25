const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/routehire', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Local MongoDB instance not reachable (${error.message}).`);
    console.warn(`[MongoDB Notice]: RouteHire Server will operate with Resilient Session & Demo Fallback.`);
    mongoose.set('bufferCommands', false);
  }
};

module.exports = connectDB;
