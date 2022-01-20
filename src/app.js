import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import expressWinston from 'express-winston';
import healthRouter from './resources/health/healthRouter.js';
import itemRouter from './resources/item/itemRouter.js';
import listRouter from './resources/list/listRouter.js';
import { notFound, developmentErrors, productionErrors } from './utils/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));
app.use(
  expressWinston.logger({
    winstonInstance: logger
  })
);

// Health endpoint
app.use('/', healthRouter);
app.use('/api/item', itemRouter);
app.use('/api/list', listRouter);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger
  })
);

app.use(notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(developmentErrors);
}

// production error handler
app.use(productionErrors);

export default app;
