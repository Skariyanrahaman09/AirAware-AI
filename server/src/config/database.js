const mongoose = require('mongoose');
let mongodInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && process.env.NODE_ENV !== 'test') {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to configured MONGO_URI (${err.message}). Falling back to in-memory database.`);
    }
  }

  // In-memory MongoDB fallback (for local development without running mongod service, and tests)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] Connected to in-memory MongoDB (${uri})`);
    return conn;
  } catch (err) {
    console.error('[Database] Failed to initialize in-memory database:', err.message);
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
    console.log('[Database] MongoDB disconnected cleanly');
  } catch (err) {
    console.error('[Database] Disconnect error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
