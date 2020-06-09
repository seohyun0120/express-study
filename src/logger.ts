import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${process.cwd() + '/src/log/server.log'}`,
      level: 'info'
    }),
    new winston.transports.Http({
      level: 'info',
      format: winston.format.json()
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      )
    })
  ]
})

export default logger;
