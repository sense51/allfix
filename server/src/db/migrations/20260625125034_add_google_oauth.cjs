exports.up = function (knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.string('google_id').nullable().unique();
      table.string('avatar').nullable();
      table.boolean('password_set').defaultTo(true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.dropColumn('google_id');
      table.dropColumn('avatar');
      table.dropColumn('password_set');
    });
};
