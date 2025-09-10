import express from 'express';
import cookieParser from 'cookie-parser';
import xss from 'xss-clean';
import helmet from 'helmet';
import { initializeDB } from '#database/index.js';
import indexRouter from '#routes/index.js';
import requestLogger from '#middlewares/requestLogger.js';
import { rateLimitMiddleware } from '#middlewares/rateLimiter.js';
import errorHandler from '#middlewares/errorHandler.js';
import { corsMiddleware } from '#middlewares/cors.js';

// Initialize DB
initializeDB();

const app = express();

app.use(helmet());
app.use(xss());
app.set('trust proxy', true);
app.use(corsMiddleware); // Apply CORS to all routes, not just /api
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(rateLimitMiddleware);
app.use('/api', requestLogger);

// Serve static files from public directory
app.use(express.static('src/public'));

// 🔗 Route registration
app.use('/', indexRouter);

// Global error handler
app.use(errorHandler);

export default app;
