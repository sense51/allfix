/**
 * SQLite doesn't support ALTER TABLE ... ALTER COLUMN, so we:
 *  1. Create a temp table with the new, expanded category constraint
 *  2. Copy all data across
 *  3. Drop the old table
 *  4. Rename temp → services
 *
 * For PostgreSQL the enum values were added in migration 004.
 */
exports.up = async function (knex) {
  if (knex.client.config.client === 'sqlite3') {
    await knex.schema.raw(`
      CREATE TABLE IF NOT EXISTS services_new (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id     INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        category        TEXT    NOT NULL CHECK(category IN ('electric','motorcycle','car','cleaning','computer','phone')),
        title           TEXT    NOT NULL,
        description     TEXT,
        price           DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        currency        TEXT NOT NULL DEFAULT 'USD'
      )
    `);
    await knex.schema.raw(`INSERT INTO services_new SELECT * FROM services`);
    await knex.schema.raw(`DROP TABLE services`);
    await knex.schema.raw(`ALTER TABLE services_new RENAME TO services`);
  }
};

exports.down = async function (knex) {
  if (knex.client.config.client === 'sqlite3') {
    await knex.schema.raw(`
      CREATE TABLE IF NOT EXISTS services_old (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id     INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        category        TEXT    NOT NULL CHECK(category IN ('electric','motorcycle','car','cleaning')),
        title           TEXT    NOT NULL,
        description     TEXT,
        price           DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        currency        TEXT NOT NULL DEFAULT 'USD'
      )
    `);
    await knex.schema.raw(`INSERT INTO services_old SELECT * FROM services WHERE category IN ('electric','motorcycle','car','cleaning')`);
    await knex.schema.raw(`DROP TABLE services`);
    await knex.schema.raw(`ALTER TABLE services_old RENAME TO services`);
  }
};
