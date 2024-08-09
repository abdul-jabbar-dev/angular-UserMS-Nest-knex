import { Knex } from "knex";
import ENV from "./src/util/ENV";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: ENV.HOST,
    user: ENV.USER,
    password: ENV.PASSWORD,
    database: ENV.DB,
    port: ENV.PORT,
  }, 
};

export default config;
