exports.up = function (knex) {
  return knex.schema.table("_delivery", function (table) {
    table.integer("delivery_received_code");  
  });
};

exports.down = function (knex) {
  return knex.schema.table("_delivery", function (table) {
    table.dropColumn("delivery_received_code");  
  });
};
