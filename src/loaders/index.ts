import { Application } from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';

export default async function (expressApp: Application) {
  await mongooseLoader();
  console.log('MongoDB Initialized');

  await expressLoader(expressApp);
  console.log('Express Initialized');
}