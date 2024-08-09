"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("_users", (table) => {
        table.string("phone").nullable().alter();
    });
}
async function down(knex) {
    await knex.schema.alterTable("_users", (table) => {
        table.string("phone").notNullable().alter();
    });
}
//# sourceMappingURL=20240807091355_create_user_phone_optional.js.map