import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

import postRouter from '../routes';
import errorHandlerMiddleware from '../errorHandlerMiddleware';

export default async function (app: Application) {
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/', postRouter);

  app.use(errorHandlerMiddleware);
  return app;
};
