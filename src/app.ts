import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import indexRouter from './routes';

dotenv.config({
  path: path.resolve(__dirname, `./../config/${process.env.NODE_ENV}.env`)
});

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.info(`Successfully connected to ${process.env.MONGO_URI}`);
    app.emit('ready');
  } catch (error) {
    console.error('Error connecting database: ', error);
    return process.exit(1);
  }
}

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);

app.on('ready', () => {
  app.listen(process.env.PORT, () => {
    console.log('server started!');
  });
});

connectDb();

export default app;