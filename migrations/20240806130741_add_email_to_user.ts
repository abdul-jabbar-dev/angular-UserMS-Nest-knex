import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("_users", (table) => {
    table.string("email").notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("_users", (table) => {
    table.dropColumn("email");
  });
}
