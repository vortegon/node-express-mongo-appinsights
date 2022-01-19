#!/usr/bin/env node
import {} from 'dotenv/config';
import * as appInsights from 'applicationinsights';
import http from 'http';
import app from '../app';
import dbConnect from '../utils/dbConnect';
import logger from '../utils/logger';

/**
 * Setup app insights telemetry.
 */
enableTelemetry();

/**
 * Create HTTP server.
 */
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

/**
 * Connect to mongo database
 * Listen on provided port, on all network interfaces.
 */
run();

async function run() {
  logger.info('You can contribute with this project on this repo: https://github.com/ey-ctp/node-api-seed');
  await dbConnect();
  server.listen(app.get('port'));
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  logger.info(`REST API running → PORT ${server.address().port}`);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  if (error.code === 'EACCES') {
    logger.error(`Port ${app.get('port')} requires elevated privileges`);
    process.exit(1);
  } else if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${app.get('port')} is already in use`);
    process.exit(1);
  } else {
    throw error;
  }
}

function enableTelemetry() {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();
    logger.info(`App Insights enabled, sending telemetry...`);
    if (process.env.APP_NAME) {
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = process.env.APP_NAME;
    } else {
      logger.info(`env variable "APP_NAME" not found, "default-app-name" will be used by the logger`);
    }
  } else {
    logger.info(`App Insights disabled, instrumentation key not provided`);
  }
}
