import loaders from './loaders';
import express, { Application } from 'express';
import logger, { customLogger } from './logger';

async function startServer() {
  const app: Application = express();
  await loaders(app);

  app.listen(8080, (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.info('Ready to start SERVER');
    logger.debug(`let's debug something here!`);
    customLogger.customedInfo('customed logger is here!');

  });
};

setImmediate(startServer);
