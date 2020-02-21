import mongoose from 'mongoose';
import { Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname, `./../../config/${process.env.NODE_ENV}.env`)
});

const DATABASE_URL = `mongodb://${process.env.MONGO_ADDRESS}${process.env.DB_NAME}`;

export default async (): Promise<Db> => {
	const { connection } = await mongoose.connect(DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	return connection.db;
}