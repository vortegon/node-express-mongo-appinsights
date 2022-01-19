import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import expressWinston from 'express-winston';
import healthRouter from './resources/health/healthRouter';
import itemRouter from './resources/item/itemRouter';
import listRouter from './resources/list/listRouter';
import { notFound, developmentErrors, productionErrors } from './utils/errorHandler';
import logger from './utils/logger';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
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

module.exports = app;
