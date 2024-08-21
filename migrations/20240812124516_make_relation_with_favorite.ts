exports.up = function (knex) {
  return knex.schema.createTable('_favorites', function (table) {
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('_users')
      .onDelete('CASCADE');
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable('_products')
      .onDelete('CASCADE');
    table.primary(['user_id', 'product_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('favorites');
};
