exports.up = function (knex) {
  return knex.schema.table("_promocode", function (table) {
    table.enu("visible", ["public", "private"]).defaultTo("private");
  });
};

exports.down = function (knex) {
  return knex.schema.table("_promocode", function (table) {
    table.dropColumn("visible");
  });
};
