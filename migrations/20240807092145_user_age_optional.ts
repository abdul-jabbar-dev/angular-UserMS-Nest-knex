import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("_users", (table) => {
    table.string("age").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("_users", (table) => {
    table.string("age").notNullable().alter();
  });
}
