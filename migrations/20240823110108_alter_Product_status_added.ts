exports.up = function (knex) {
  return knex.schema.alterTable("_shippingOrder", function (table) {
    table
      .enu("order_status", ["expired", "pending", "paid"])
      .defaultTo("pending");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("_shippingOrder", function (table) {
    table.dropColumn("order_status");
  });
};
