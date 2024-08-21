exports.up = function (knex) {
    return knex.schema.table("_products", function (table) {
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
};
exports.down = function (knex) {
    return knex.schema.table("_products", function (table) {
        table.dropColumn("created_at");
    });
};
//# sourceMappingURL=20240816091057_add_created_at_to_products.js.map