exports.up = function (knex) {
  return knex.schema.table("_promocode", function (table) {
    table.integer("author_id").unsigned().notNullable().after("is_active"); 
    table.foreign("author_id").references("id").inTable("_users");
  });
};

exports.down = function (knex) {
  return knex.schema.table("_promocode", function (table) {
    table.dropForeign("author_id");
    table.dropColumn("author_id"); 
  });
};
