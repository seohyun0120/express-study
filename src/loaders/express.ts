import { Application } from 'express';
import bodyParser from 'body-parser';
import postRouter from '../routes';

export default async ({ app }: { app: Application }) => {
	app.use(bodyParser.json());
	app.use('/', postRouter);

	return app;
};

