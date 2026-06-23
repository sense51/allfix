exports.up = function (knex) {
  return knex.schema.alterTable('services', (table) => {
    table.string('currency', 3).notNullable().defaultTo('USD');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('services', (table) => {
    table.dropColumn('currency');
  });
};
