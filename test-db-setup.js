import mongoose from 'mongoose';
import cuid from 'cuid';
import _ from 'lodash';
import Item from './src/resources/item/itemModel.js';
import List from './src/resources/list/listModel.js';
import logger from './src/utils/logger.js';

const models = { List, Item };

const url = process.env.DATABASE || 'mongodb://localhost:27017/test';

global.newId = () => mongoose.Types.ObjectId();

const remove = (collection) =>
  new Promise((resolve, reject) => {
    collection.deleteMany({}, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

beforeAll(async (done) => {
  try {
    const db = cuid();
    const tempDB = url.includes('?') ? url.replace(/\?([^?]*)$/, `${db}?$1`) : url + db;
    logger.info(`creating database: ${db}`);
    await mongoose.connect(tempDB);
    await Promise.all(Object.keys(models).map((name) => models[name].init()));
  } catch (e) {
    logger.error(e);
    throw e;
  }

  done();
});

beforeEach(async (done) => {
  async function clearDB() {
    logger.info(`cleaning DB`);
    return Promise.all(_.map(mongoose.connection.collections, (c) => remove(c)));
  }

  await clearDB();

  done();
});

afterAll(async (done) => {
  logger.info(`deleting database`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});
