import mongoose from 'mongoose';
import cuid from 'cuid';
import _ from 'lodash';
import Item from './src/resources/item/itemModel';
import List from './src/resources/list/listModel';
import logger from './src/utils/logger';

const models = { List, Item };

const url = process.env.DATABASE || 'mongodb://localhost:27017/test';

global.newId = () => mongoose.Types.ObjectId();

const remove = (collection) =>
  new Promise((resolve, reject) => {
    collection.deleteMany({}, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

beforeEach(async (done) => {
  const db = cuid();
  function clearDB() {
    logger.info(`cleaning DB`);
    return Promise.all(_.map(mongoose.connection.collections, (c) => remove(c)));
  }

  if (mongoose.connection.readyState === 0) {
    try {
      const tempDB = url.includes('?') ? url.replace(/\?([^?]*)$/, `${db}?$1`) : url + db;
      await mongoose.connect(tempDB);
      await clearDB();
      await Promise.all(Object.keys(models).map((name) => models[name].init()));
    } catch (e) {
      logger.error(e);
      throw e;
    }
  } else {
    await clearDB();
    logger.info(`connection readyState`);
  }
  done();
});

afterEach(async (done) => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});

afterAll((done) => done());
