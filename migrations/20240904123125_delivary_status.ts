exports.up = function (knex) {
  return knex.schema.alterTable("_delivery", function (table) {
    if (!knex.schema.hasColumn("_delivery", "delivery_status")) {
      table
        .enum("delivery_status", ["packaging", "transit", "delivery"])
        .defaultTo("packaging");
    }
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("_delivery", function (table) {
    table.dropColumn("delivery_status");
  });
};
