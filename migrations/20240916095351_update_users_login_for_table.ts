exports.up = function (knex) {
  return knex.schema.table("_users_login_for", function (table) {
    table.float("latitude").nullable(); 
    table.float("longitude").nullable(); 
  });
};

exports.down = function (knex) {
  return knex.schema.table("_users_login_for", function (table) {
    table.dropColumn("latitude");
    table.dropColumn("longitude");
  });
};
