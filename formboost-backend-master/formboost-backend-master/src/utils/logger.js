import winston from 'winston';
// import Transport from 'winston-transport';
import { Context } from '#utils/context.js';
import { isEmptyObject } from '#utils/index.js';
// import LokiTransport from 'winston-loki';

const consoleFormat = winston.format.combine(
  winston.format.colorize({
    all: true,
    colors: { info: 'green', error: 'red', warn: 'yellow', debug: 'blue' },
  }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, data, metadata }) => {
    const dataStr = !isEmptyObject(data) ? `\ndata: ${JSON.stringify(data, null, 2)}` : '';
    const metaStr = !isEmptyObject(metadata)
      ? `\nmetadata: ${JSON.stringify(metadata, null, 2)}`
      : '';
    return `${level}:[${timestamp}]: ${message}${dataStr}${metaStr}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Loki logging disabled for minimal setup

// class DBTransport extends Transport {
//   log(info, callback) {
//     setImmediate(() => this.emit('logged', info));
//     try {
//       const { level, message, timestamp, data, metadata } = info;
//       // await LogService.insert(info);
//       console.log('Log info to be inserted into DB:', {
//         level,
//         message,
//         timestamp,
//         data,
//         metadata,
//       });
//     } catch (err) {
//       console.error('Failed to insert log into DB:', err);
//     }
//     callback();
//   }
// }

// if (config.isProd) {
//   transports.push(new DBTransport());
// }

const baseLogger = winston.createLogger({
  transports,
});

const log = (level, input) => {
  let payload;

  if (typeof input === 'string') {
    payload = { name: input };
  } else {
    payload = input;
  }

  const ctx = Context.get() || {};
  baseLogger.log({
    level,
    message: payload.name || '',
    timestamp: new Date().toISOString(),
    data: payload.data || {},
    metadata: ctx,
  });
};

const logger = {
  info: (payload) => log('info', payload),
  error: (payload) => log('error', payload),
  warn: (payload) => log('warn', payload),
  debug: (payload) => log('debug', payload),
  log: (level, payload) => log(level, payload),
};

export default logger;
