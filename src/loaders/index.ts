import { Application } from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import logger from '../logger';

export default async function (expressApp: Application) {
  await mongooseLoader();
  logger.info('MongoDB Initialized');

  await expressLoader(expressApp);
  logger.info('Express Initialized');

  await logger;
}