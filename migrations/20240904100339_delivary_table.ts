exports.up = function (knex) {
  return knex.schema.createTable("_delivery", (table) => {
    table.increments("id").primary(); 
    table.string("delivery_status").notNullable().defaultTo("packaging"); 
    table.integer("order_id").unsigned().notNullable(); 
    table
      .foreign("order_id")
      .references("id")
      .inTable("_shippingOrder")
      .onDelete("CASCADE");  
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("_delivery");
};
