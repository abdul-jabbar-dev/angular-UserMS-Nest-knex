import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("_products", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("desc").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("image").notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("_users.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("_products");
}
