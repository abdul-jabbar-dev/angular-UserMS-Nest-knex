exports.up = function (knex) {
  return knex.schema.dropTableIfExists("_users").then(() => {
    return knex.schema.createTable("_users", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable().unique();
      table.string("password").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.integer("age").notNullable();
      table.string("phone").notNullable().unique();
      table.enu("status", ["active", "deactive"]).defaultTo("active");
      table.enu("role", ["admin", "subscriber"]).defaultTo("subscriber");
      table.timestamps(true, true);
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("_users");
};
