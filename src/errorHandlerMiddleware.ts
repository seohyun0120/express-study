import { NextFunction, Request, Response } from 'express';
import HttpException from './exceptions/HttpException';
import logger from './logger';

function errorHandleMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof HttpException) {
    logger.error(`code: 500]\nmsg:${err.message}`);
    return res.status(err.status).json({
      isSucceeded: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  };

  logger.error(`[code: 500]\nmsg:${err.message}`);
  return res.status(500).json({
    isSucceeded: false,
    error: {
      code: 500,
      message: 'Internal Server Error'
    }
  });
};

export default errorHandleMiddleware;
