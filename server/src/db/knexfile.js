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

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const prodConfig = dbUrl
  ? {
      client: 'pg',
      connection: {
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
      },
      pool: { min: 2, max: 10 },
    }
  : {
      client: 'sqlite3',
      connection: {
        filename: path.resolve('/tmp', 'allfix.sqlite3'),
      },
      useNullAsDefault: true,
    };

export default isProd ? { ...baseConfig, ...prodConfig } : {
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
