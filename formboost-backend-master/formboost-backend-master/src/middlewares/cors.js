import cors from 'cors';
import config from '#config/index.js';
import { GenerateError } from '#utils/exception.js';

const allowedOrigins = [config.app.webAppUrl, config.app.webAdminUrl];

if (!config.isProd) {
  allowedOrigins.push('http://localhost:3000');
  allowedOrigins.push('http://localhost:3001');
  allowedOrigins.push('http://localhost:5173'); // Add Vite dev server
  allowedOrigins.push('http://localhost:5174'); // Add Vite dev server
  allowedOrigins.push('localhost');
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or server-to-server)
    if (!origin && !config.isProd) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new GenerateError({
          name: 'ForbiddenError',
          message: 'Not allowed by CORS',
          status: 403,
        })
      );
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

export const corsMiddleware = (req, res, next) => {
  // Allow ANY origin to submit forms to the public submission endpoint `/:alias`
  // This enables copy-paste HTML forms to post from any website
  const isPublicFormSubmission = req.method === 'POST' && /^\/[A-Za-z0-9_-]+$/.test(req.path || '');

  if (isPublicFormSubmission) {
    const openCors = {
      origin: true, // reflect request origin
      credentials: false, // no cookies needed for public submissions
      methods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 86400,
    };
    return cors(openCors)(req, res, (err) => {
      if (err) return res.status(403).end();
      next();
    });
  }

  // Default strict CORS for API and authenticated routes
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      return res.status(403).end();
    }
    next();
  });
};
