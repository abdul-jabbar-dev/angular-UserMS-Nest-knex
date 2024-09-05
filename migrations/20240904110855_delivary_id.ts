exports.up = function (knex) {
  return knex.schema.table("_delivery", (table) => {
    table
      .integer("delivery_boy_id")
      .unsigned()
      .references("id")
      .inTable("_users")
      .onDelete("SET NULL");
  });
};

exports.down = function (knex) {
  return knex.schema.table("_delivery", (table) => {
    table.dropColumn("delivery_boy");
  });
};
