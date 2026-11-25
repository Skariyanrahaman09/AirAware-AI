const mongoose = require('mongoose');

let mongodInstance = null;

/**
 * Sanitizes MongoDB connection string to safely log without leaking credentials
 */
const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/(.*):(.*)@/, '//$1:****@');
};

/**
 * Returns current database connection status
 */
const getDatabaseStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Connect to MongoDB Atlas (Production) or In-Memory fallback (Development/Test only)
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  // 1. Production Mode: Strictly require external MongoDB URI (e.g. MongoDB Atlas)
  if (isProduction) {
    if (!mongoUri) {
      const errMsg = '[Database Error] MONGO_URI is required in production mode. Refusing to launch with ephemeral in-memory storage.';
      console.error(errMsg);
      throw new Error(errMsg);
    }

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      console.log(`[Database] Connected successfully to persistent MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[Database Error] Failed to connect to persistent database at ${sanitizeMongoUri(mongoUri)}: ${err.message}`);
      // In production, NEVER fall back to in-memory database. Fail startup cleanly.
      throw err;
    }
  }

  // 2. Development Mode with configured MONGO_URI
  if (mongoUri && !isTest) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to external MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to MONGO_URI (${err.message}). Falling back to local in-memory database for development.`);
    }
  }

  // 3. In-memory MongoDB fallback (Allowed ONLY in development and automated testing)
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

/**
 * Cleanly disconnect database and stop in-memory instances
 */
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

// Global connection event handlers for resilience & observability
mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('[Database Alert] Mongoose connection lost. Attempting to reconnect...');
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] Mongoose reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Database Alert] Mongoose runtime connection error:', err.message);
  }
});

module.exports = {
  connectDB,
  disconnectDB,
  getDatabaseStatus,
  sanitizeMongoUri,
};
