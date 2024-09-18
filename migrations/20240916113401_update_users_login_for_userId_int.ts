exports.up = function (knex) {
  return knex.schema.alterTable("_users_login_for", (table) => {
    table.integer("user_id").alter();  
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("_users_login_for", (table) => {
    table.string("user_id").alter(); 
  });
};
