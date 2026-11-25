const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, HOST, () => {
      console.log(`===============================================`);
      console.log(` AirAware AI Server running on ${HOST}:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health: http://${HOST}:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      console.error('[Unhandled Rejection Alert]:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('[Uncaught Exception Fatal]:', err);
      shutdown('uncaughtException');
    });
  } catch (err) {
    console.error('Fatal startup error:', err.message);
    process.exit(1);
  }
};

startServer();
