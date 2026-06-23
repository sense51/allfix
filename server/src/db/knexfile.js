import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const baseConfig = {
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'cjs',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
    extension: 'cjs',
  },
};

export default isProd
  ? {
      ...baseConfig,
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      },
      pool: { min: 2, max: 10 },
    }
  : {
      ...baseConfig,
      client: 'sqlite3',
      connection: {
        filename: path.resolve(__dirname, 'dev.sqlite3'),
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys = ON', cb);
        },
      },
    };
