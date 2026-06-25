import knex from 'knex';
import config from './server/src/db/knexfile.js';

async function run() {
  console.log('--- STARTING RUN_MIGRATIONS SCRIPT ---');
  console.log('DB client config:', config.client);
  console.log('Has DATABASE_URL:', !!process.env.DATABASE_URL);
  console.log('Has POSTGRES_URL:', !!process.env.POSTGRES_URL);

  const db = knex(config);
  try {
    const [batchNo, log] = await db.migrate.latest({
      directory: config.migrations.directory
    });
    if (log.length === 0) {
      console.log('Already up to date.');
    } else {
      console.log('Batch ' + batchNo + ' run: ' + log.length + ' migrations');
      console.log(log.join('\n'));
    }
    process.exit(0);
  } catch (err) {
    console.error('!!! MIGRATION ERROR DETECTED !!!');
    console.error(err);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

run();
