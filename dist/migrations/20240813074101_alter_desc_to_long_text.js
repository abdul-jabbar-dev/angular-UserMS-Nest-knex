"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('_products', (table) => {
        table.text('desc').alter();
    });
}
async function down(knex) {
    await knex.schema.alterTable('_products', (table) => {
        table.string('desc').notNullable().alter();
    });
}
//# sourceMappingURL=20240813074101_alter_desc_to_long_text.js.map