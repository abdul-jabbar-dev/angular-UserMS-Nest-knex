
exports.up = function (knex) {
  return knex.schema.createTable("_users_login_for", function (table) {
    table.increments("id").primary(); 
    table.string("user_id").notNullable(); 
    table.timestamp("login_at").defaultTo(knex.fn.now()); // Timestamp of login
    table.string("device_info").nullable(); // Optional: Information about the device
    table.string("ip_address").nullable(); // Optional: IP address of the user
    table.timestamps(true, true); // Created at and updated at timestamps
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("_users_login_for");
};
