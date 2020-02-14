import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import indexRouter from './routes';

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome @Seohyun')
});

app.listen(8080, () => {
	console.log('server started!')
});

const MONGO_URI = 'mongodb://172.19.148.76:8000/post';
const db = () => {
	mongoose
		.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			return console.info(`Successfully connected to ${MONGO_URI}`);
		})
		.catch((error) => {
			console.error('Error connecting database: ', error);
			return process.exit(1);
		});
};

db();