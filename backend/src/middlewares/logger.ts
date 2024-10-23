import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'request.log'),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, meta }) =>
        `${timestamp} [${level}]: ${message} - ${meta.req.method} ${meta.req.url}`
    )
  ),
  meta: true,
  msg: 'HTTP {{res.statusCode}} {{req.method}} {{req.url}}',
  level(_req, res) {
    if (res.statusCode >= 100 && res.statusCode < 400) {
      return 'info';
    }
    if (res.statusCode >= 400 && res.statusCode < 600) {
      return 'error';
    }
    return 'info';
  },
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs', 'error.log'),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, meta }) =>
        `${timestamp} [${level}]: ${message} - ${meta.req.method} ${meta.req.url}`
    )
  ),
  meta: true,
  msg: 'ERROR {{err.message}} - {{req.method}} {{req.url}} \n {{err.stack}}',
});
