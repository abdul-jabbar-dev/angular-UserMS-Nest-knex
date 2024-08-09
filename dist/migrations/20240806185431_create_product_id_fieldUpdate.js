"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
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
//# sourceMappingURL=20240806185431_create_product_id_fieldUpdate.js.map