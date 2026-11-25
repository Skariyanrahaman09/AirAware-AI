const mongoose = require('mongoose');
let mongodInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isTest = process.env.NODE_ENV === 'test';
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isTest && mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('[Database] Configured MongoDB connection failed.');
      throw err;
    }
  }

  if (isProduction) {
    throw new Error('MONGO_URI must be configured in production. In-memory databases are development/test only.');
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongodInstance.getUri());
    console.log('[Database] Connected to in-memory MongoDB (development/test only).');
    return conn;
  } catch (err) {
    console.error('[Database] Failed to initialize in-memory database:', err.message);
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
  } catch (err) {
    console.error('[Database] Disconnect error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
