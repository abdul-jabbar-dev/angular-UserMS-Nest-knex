"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("_users", (table) => {
        table.string("age").nullable().alter();
    });
}
async function down(knex) {
    await knex.schema.alterTable("_users", (table) => {
        table.string("age").notNullable().alter();
    });
}
//# sourceMappingURL=20240807092145_user_age_optional.js.map