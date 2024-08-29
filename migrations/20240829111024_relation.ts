exports.up = function (knex) {
  return knex.schema.table("_shippingOrder", function (table) {
    table
      .integer("promocode_id")
      .unsigned()
      .references("id")
      .inTable("_promocode")
      .onDelete("SET NULL"); 
  });
};

exports.down = function (knex) {
  return knex.schema.table("_shippingOrder", function (table) {
    table.dropColumn("promocode_id");
  });
};
