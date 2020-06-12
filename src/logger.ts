import winston, { Logger, createLogger, transports, format, config } from 'winston';
interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

let logger: Logger = null;
logger = createLogger({
  transports: [
    new transports.File({
      level: 'silly',
      filename: `${process.cwd() + '/src/log/server.log'}`,
      format: format.combine(
        format.timestamp({
          format: 'YYYY.MM.DD HH:mm:ss'
        }),
        format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.message}`),
      )
    }),
    new transports.Console({
      level: 'silly',
      format: format.combine(
        format.label({ label: '[my-server]' }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize(),
        format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
      )
    })
  ]
});

const customLevels: config.AbstractConfigSetLevels = {
  customedError: 0,
  customedWarn: 1,
  customedInfo: 2,
  customedDebug: 3,
  customedSilly: 4
}

const customColors: config.AbstractConfigSetColors = {
  customedError: 'red',
  customedWarn: 'yellow',
  customedInfo: 'cyan',
  customedDebug: 'magenta',
  customedSilly: 'gray'
}
interface CustomLevels extends winston.Logger {
  customedError: winston.LeveledLogMethod;
  customedWarn: winston.LeveledLogMethod;
  customedInfo: winston.LeveledLogMethod;
  customedDebug: winston.LeveledLogMethod;
  customedSilly: winston.LeveledLogMethod;
}

winston.addColors(customColors);

export const customLogger: CustomLevels = <CustomLevels>createLogger({
  levels: customLevels,
  format: format.combine(
    format.label({ label: '[customed-server]' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
  ),
  transports: [
    new transports.Console({ level: 'customedSilly' })
  ]
});

export default logger;