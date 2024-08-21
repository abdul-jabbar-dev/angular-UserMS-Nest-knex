exports.up = function (knex) {
  return knex.schema.table('_products', function (table) {
    table.enu('status', ['available', 'sold', 'hide']).defaultTo('available');
  });
};

exports.down = function (knex) {
  return knex.schema.table('_products', function (table) {
    table.dropColumn('status');
  });
};
