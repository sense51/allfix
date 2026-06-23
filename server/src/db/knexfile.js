import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'dev.sqlite3')
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'cjs',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
    extension: 'cjs',
  },
};
