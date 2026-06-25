exports.up = async function (knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.raw(`ALTER TYPE "public"."services_category_enum" ADD VALUE IF NOT EXISTS 'computer'`);
    await knex.schema.raw(`ALTER TYPE "public"."services_category_enum" ADD VALUE IF NOT EXISTS 'phone'`);
  }
};

exports.down = async function (knex) {
  // PostgreSQL doesn't support removing enum values cleanly.
};
