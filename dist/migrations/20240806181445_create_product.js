"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTableIfExists("_products");
}
//# sourceMappingURL=20240806181445_create_product.js.map