import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> { 
  await knex.schema.table("_products", (table) => {
    table.dropPrimary();  
  });
 
  await knex.schema.table("_products", (table) => {
    table.increments("new_id").primary();  
  });
 
  await knex.schema.table("_products", (table) => {
    table.dropColumn("id");
  });
 
  await knex.schema.table("_products", (table) => {
    table.renameColumn("new_id", "id");
  });
}

export async function down(knex: Knex): Promise<void> { 
  await knex.schema.table("_products", (table) => {
    table.uuid("id").primary();
  });
 
  await knex.schema.table("_products", (table) => {
    table.dropColumn("id");
  });
 
  await knex.schema.table("_products", (table) => {
    table.uuid("new_id").primary();  
  });
 
  await knex.schema.table("_products", (table) => {
    table.renameColumn("new_id", "id");
  });
}
