exports.up = function (knex) {
  return knex.schema.createTable("_shippingOrder", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("_users")
      .onDelete("CASCADE");
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("_products")
      .onDelete("CASCADE");
    table
      .string("order_number")
      .unique()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("shipping_email").notNullable();
    table.string("shipping_phone").notNullable();
    table.string("shipping_zone").notNullable();
    table.decimal("shipping_cost", 10, 2).notNullable();
    table.string("address_line1").notNullable();
    table.string("address_line2");
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.string("country").notNullable();
    table.string("zip").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("_shippingOrder");
};
