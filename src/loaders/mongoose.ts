import mongoose from 'mongoose';
import { Db } from 'mongodb';
import { config } from '../utils';

const DATABASE_URL = `mongodb://${config.MONGO_ADDRESS}${config.DB_NAME}`;

export default async function (): Promise<Db> {
  const { connection } = await mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return connection.db;
}