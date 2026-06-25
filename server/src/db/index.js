import knex from 'knex';
import config from './knexfile.js';

let instance;

function getDb() {
  if (!instance) {
    try {
      instance = knex(config);
    } catch (e) {
      return {
        raw: async () => { throw new Error('Database unavailable: ' + e.message); },
        from: () => { throw new Error('Database unavailable: ' + e.message); },
        table: () => { throw new Error('Database unavailable: ' + e.message); },
        insert: () => { throw new Error('Database unavailable: ' + e.message); },
        where: () => { throw new Error('Database unavailable: ' + e.message); },
        select: () => { throw new Error('Database unavailable: ' + e.message); },
        first: () => { throw new Error('Database unavailable: ' + e.message); },
      };
    }
  }
  return instance;
}

const db = new Proxy(function() {}, {
  apply(target, thisArg, argumentsList) {
    const d = getDb();
    return d(...argumentsList);
  },
  get(_, prop) {
    const d = getDb();
    const value = d[prop];
    if (typeof value === 'function') {
      return value.bind(d);
    }
    return value;
  }
});

export default db;
