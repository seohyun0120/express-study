import { Application } from 'express';
import bodyParser from 'body-parser';
import postRouter from '../routes';
import errorHandleMiddleware from '../errorHandlerMiddleware';

export default async function (app: Application) {
  app.use(bodyParser.json());
  app.use('/', postRouter);

  app.use(errorHandleMiddleware);
  return app;
};
