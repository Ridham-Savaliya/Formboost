#!/usr/bin/env node
import http from 'http';
import app from './app.js';
import config from '#config/index.js';
import logger from '#utils/logger.js';

// Get port and set it in Express
const port = config.app.port || 3001; // Use 3001 if 3000 is busy
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) =>
  handleProcessError('Unhandled Rejection', reason, promise)
);
process.on('uncaughtException', (err) => handleProcessError('Uncaught Exception', err));

// Graceful shutdown
function handleProcessError(type, error) {
  logger.error(`${type} occurred:`, error);
  shutdown(`${type}`);
}

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Formboom Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Basic API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'Formboom API Server',
    version: '0.0.1',
    endpoints: ['/api/health'],
  });
});

function shutdown(reason) {
  logger.info(`Shutting down server due to: ${reason}`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });

  // Force shutdown after 5 seconds if not closed
  setTimeout(() => {
    console.error('Forcing server shutdown...');
    process.exit(1);
  }, 5000).unref();
}

// Event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  handleSpecificErrors(error, bind);
}

function handleSpecificErrors(error, bind) {
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event
function onListening() {
  const addr = server.address();
  logger.info(`Environment: ${config.app.env}`);
  logger.info(`Server running on http://localhost:${addr.port}`);
}
