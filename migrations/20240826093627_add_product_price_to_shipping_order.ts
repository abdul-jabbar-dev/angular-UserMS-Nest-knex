import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("_shippingOrder", (table) => {
    table.decimal("product_price", 10, 2).notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("_shippingOrder", (table) => {
    table.dropColumn("product_price");
  });
}
