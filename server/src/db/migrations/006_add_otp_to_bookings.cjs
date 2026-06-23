exports.up = function (knex) {
  return knex.schema.alterTable('bookings', (table) => {
    table.string('otp', 4);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bookings', (table) => {
    table.dropColumn('otp');
  });
};
