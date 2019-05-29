import winston from 'winston';

const consoleTransport = new winston.transports.Console();

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [consoleTransport]
});
