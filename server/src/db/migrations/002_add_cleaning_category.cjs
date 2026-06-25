exports.up = async function (knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.raw(`ALTER TYPE "public"."services_category_enum" ADD VALUE IF NOT EXISTS 'cleaning'`);
  }
};

exports.down = async function (knex) {
  // PostgreSQL doesn't support removing values from enums easily.
  // This is a no-op down migration.
};
