exports.up = function (knex) {
  return knex.schema.alterTable("_users_login_for", function (table) {
    table.renameColumn("ip_address", "device_id");
    table.renameColumn("device_info", "userAgent");
    table.string("platform").notNullable();
    table.string("location").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("_users_login_for", function (table) {
    table.renameColumn("device_id", "ip_address");
    table.renameColumn("userAgent", "device_info");
    table.dropColumn("platform");
    table.dropColumn("location");
  });
};
