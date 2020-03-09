import { NextFunction, Request, Response } from 'express';
import HttpException from './exceptions/HttpException';

function errorHandleMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const isSucceeded = err.isSucceeded || false;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 500;

  res.status(status).json({ isSucceeded, error: { code, message } });
};

export default errorHandleMiddleware;
