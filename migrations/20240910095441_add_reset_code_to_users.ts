

exports.up = function (knex) {
  return knex.schema.table("_users", function (table) {
    table.string("reset_code").nullable(); 
  });
};

exports.down = function (knex) {
  return knex.schema.table("_users", function (table) {
    table.dropColumn("reset_code"); 
  });
};
