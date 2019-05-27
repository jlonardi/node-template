const winston = require('winston');

const consoleTransport = new winston.transports.Console();

module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [consoleTransport]
});
