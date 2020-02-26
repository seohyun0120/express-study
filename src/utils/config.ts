import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, `./../../config/${process.env.NODE_ENV}.env`)
});

const MONGO_ADDRESS = process.env.MONGO_ADDRESS;
const DB_NAME = process.env.DB_NAME;

export default { MONGO_ADDRESS, DB_NAME };