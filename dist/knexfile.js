"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV_1 = require("./src/util/ENV");
const config = {
    client: "pg",
    connection: {
        host: ENV_1.default.HOST,
        user: ENV_1.default.USER,
        password: ENV_1.default.PASSWORD,
        database: ENV_1.default.DB,
        port: ENV_1.default.PORT,
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map