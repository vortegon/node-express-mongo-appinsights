import mongoose from 'mongoose';
import cuid from 'cuid';
import _ from 'lodash';
import Item from './src/resources/item/itemModel';
import List from './src/resources/list/listModel';
import logger from './src/utils/logger';

const models = { List, Item };

const url = process.env.DATABASE || 'mongodb://localhost:27017/test';

global.newId = () => {
  return mongoose.Types.ObjectId();
};

const remove = collection =>
  new Promise((resolve, reject) => {
    collection.remove(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

beforeEach(async done => {
  const db = cuid();
  function clearDB() {
    return Promise.all(_.map(mongoose.connection.collections, c => remove(c)));
  }

  if (mongoose.connection.readyState === 0) {
    try {
      const tempDB = url.includes('?') ? url.replace(/\?([^?]*)$/, `${db}?$1`) : url + db;
      await mongoose.connect(tempDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      await clearDB();
      await Promise.all(Object.keys(models).map(name => models[name].init()));
    } catch (e) {
      logger.error(e);
      throw e;
    }
  } else {
    await clearDB();
  }
  done();
});

afterEach(async done => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});

afterAll(done => {
  return done();
});
