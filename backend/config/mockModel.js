const mongoose = require('mongoose');
const crypto = require('crypto');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateId = () => crypto.randomBytes(12).toString('hex');

const createOfflineFallbackModel = (MongooseModel, { defaults = {}, seed = [] } = {}) => {
  const store = seed.map((item) => ({
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...defaults,
    ...item,
  }));

  const wrapDoc = (doc) => {
    if (!doc) return null;
    return {
      ...doc,
      id: doc._id,
      async deleteOne() {
        const idx = store.findIndex((item) => item._id === doc._id);
        if (idx !== -1) store.splice(idx, 1);
        return { deletedCount: idx !== -1 ? 1 : 0 };
      },
    };
  };

  const makeQuery = (items) => {
    let result = [...items];
    const queryObj = {
      sort(sortSpec = {}) {
        const entries = Object.entries(sortSpec);
        if (entries.length > 0) {
          const [field, dir] = entries[0];
          const multiplier = dir === -1 || dir === 'desc' ? -1 : 1;
          result.sort((a, b) => {
            const av = a[field] ? new Date(a[field]).getTime() || a[field] : 0;
            const bv = b[field] ? new Date(b[field]).getTime() || b[field] : 0;
            if (av < bv) return -1 * multiplier;
            if (av > bv) return 1 * multiplier;
            return 0;
          });
        }
        return queryObj;
      },
      select(fields = '') {
        if (typeof fields === 'string' && fields.startsWith('-')) {
          const excluded = fields
            .split(/\s+/)
            .filter((f) => f.startsWith('-'))
            .map((f) => f.slice(1));
          result = result.map((item) => {
            const clone = { ...item };
            excluded.forEach((key) => delete clone[key]);
            return clone;
          });
        }
        return queryObj;
      },
      then(resolve, reject) {
        return Promise.resolve(result.map((d) => ({ ...d }))).then(resolve, reject);
      },
    };
    return queryObj;
  };

  return {
    find(filter = {}) {
      if (isDbConnected()) return MongooseModel.find(filter);
      const matched = store.filter((item) =>
        Object.entries(filter).every(([k, v]) => item[k] === v)
      );
      return makeQuery(matched);
    },

    async findOne(filter = {}) {
      if (isDbConnected()) return MongooseModel.findOne(filter);
      const found = store.find((item) =>
        Object.entries(filter).every(([k, v]) => item[k] === v)
      );
      return wrapDoc(found);
    },

    async findById(id) {
      if (isDbConnected()) return MongooseModel.findById(id);
      const found = store.find((item) => item._id === id);
      return wrapDoc(found);
    },

    async create(data) {
      if (isDbConnected()) return MongooseModel.create(data);
      const now = new Date().toISOString();
      const doc = {
        ...JSON.parse(JSON.stringify(defaults)),
        ...data,
        _id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      store.push(doc);
      return wrapDoc(doc);
    },

    async findByIdAndUpdate(id, update, options) {
      if (isDbConnected()) return MongooseModel.findByIdAndUpdate(id, update, options);
      const idx = store.findIndex((item) => item._id === id);
      if (idx === -1) return null;
      store[idx] = {
        ...store[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return wrapDoc(store[idx]);
    },
  };
};

module.exports = createOfflineFallbackModel;
