import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('_products', (table) => {
    table.text('desc').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('_products', (table) => {
    table.string('desc').notNullable().alter();
  });
}
