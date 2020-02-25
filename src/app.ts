import loaders from './loaders';
import express, { Application } from 'express';

async function startServer() {
  const app: Application = express();
  await loaders(app);

  app.listen(8080, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Ready to start SERVER');
  });
};

setImmediate(startServer);
