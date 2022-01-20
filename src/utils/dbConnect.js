import mongoose from 'mongoose';
import logger from './logger.js';

const dbConnect = async (url = process.env.DATABASE, opts = {}) => {
  mongoose.connection.on('error', (err) => {
    logger.error(err);
  });

  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to cosmosdb...');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Connection with cosmosdb stablished successfully');
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('Cosmosdb disconected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('Cosmosdb reconnected successfully');
  });

  mongoose.connection.on('reconnectFailed', () => {
    logger.error('Reconection with cosmosdb failed');
  });

  try {
    await mongoose.connect(url, {
      ...opts,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  } catch (error) {
    logger.error(error);
  }
};

export default dbConnect;
