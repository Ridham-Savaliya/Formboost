#!/usr/bin/env node
import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(cors({
  origin: [
    process.env.WEB_ADMIN_URL || 'http://localhost:5173',
    process.env.WEB_APP_URL || 'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FormBoost Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API routes placeholder
app.get('/api', (req, res) => {
  res.json({ 
    message: 'FormBoost API Server',
    version: '0.0.1',
    endpoints: ['/api/health']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(port, () => {
  console.log(`✅ FormBoost Backend running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
