"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.table("_users", (table) => {
        table.string("email").notNullable().unique();
    });
}
async function down(knex) {
    return knex.schema.table("_users", (table) => {
        table.dropColumn("email");
    });
}
//# sourceMappingURL=20240806130741_add_email_to_user.js.map