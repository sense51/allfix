exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.enum('role', ['customer', 'provider']).notNullable();
      table.string('phone', 20);
      table.string('location');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('providers', (table) => {
      table.increments('id');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.text('bio');
      table.decimal('avg_rating', 3, 2).defaultTo(0);
      table.boolean('is_verified').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('services', (table) => {
      table.increments('id');
      table
        .integer('provider_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('providers')
        .onDelete('CASCADE');
      table
        .enu('category', ['electric', 'motorcycle', 'car', 'cleaning'], { useNative: true, enumName: 'services_category_enum' })
        .notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.integer('duration_minutes').defaultTo(60);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('bookings', (table) => {
      table.increments('id');
      table
        .integer('service_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE');
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .enu('status', ['pending', 'confirmed', 'completed', 'cancelled'])
        .defaultTo('pending');
      table.timestamp('scheduled_at').notNullable();
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('reviews', (table) => {
      table.increments('id');
      table
        .integer('booking_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE');
      table.integer('rating').notNullable().checkBetween([1, 5]);
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('reviews')
    .dropTableIfExists('bookings')
    .dropTableIfExists('services')
    .dropTableIfExists('providers')
    .dropTableIfExists('users');
};
