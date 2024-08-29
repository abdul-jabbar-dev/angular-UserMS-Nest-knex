exports.up = function (knex) {
  return knex.schema.createTable("_promocode", function (table) {
    table.increments("id").primary();
    table.string("code").notNullable().unique();
    table.decimal("discount_amount", 10, 2).notNullable();
    table.enu("discount_type", ["percentage", "fixed"]).notNullable();
    table.timestamp("valid_from").notNullable();
    table.timestamp("valid_to").notNullable();
    table.integer("usage_limit").unsigned().defaultTo(1);
    table.integer("times_used").unsigned().defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("_promocode");
};
