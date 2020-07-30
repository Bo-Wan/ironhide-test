const winston = require('winston');

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
