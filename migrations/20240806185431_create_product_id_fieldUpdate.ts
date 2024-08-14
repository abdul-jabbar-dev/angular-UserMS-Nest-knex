import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Step 1: Drop the existing primary key constraint if necessary
  await knex.schema.table("_products", (table) => {
    table.dropPrimary(); // Remove the existing primary key
  });

  // Step 2: Add the new auto-incrementing column
  await knex.schema.table("_products", (table) => {
    table.increments("new_id").primary(); // Add new auto-incrementing primary key
  });

  // Step 3: Drop the old UUID column
  await knex.schema.table("_products", (table) => {
    table.dropColumn("id");
  });

  // Step 4: Rename the new column to 'id'
  await knex.schema.table("_products", (table) => {
    table.renameColumn("new_id", "id");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Step 1: Add the old UUID column back
  await knex.schema.table("_products", (table) => {
    table.uuid("id").primary();
  });

  // Step 2: Drop the new auto-incrementing column
  await knex.schema.table("_products", (table) => {
    table.dropColumn("id");
  });

  // Step 3: Restore the UUID column as 'new_id' if necessary
  await knex.schema.table("_products", (table) => {
    table.uuid("new_id").primary(); // Add back UUID column as primary key
  });

  // Step 4: Rename the UUID column back to 'id'
  await knex.schema.table("_products", (table) => {
    table.renameColumn("new_id", "id");
  });
}
