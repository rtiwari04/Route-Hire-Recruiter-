const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/routehire_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    console.log('[MongoDB Fallback] Backend will run in API mock mode if MongoDB is offline.');
  }
};
module.exports = connectDB;