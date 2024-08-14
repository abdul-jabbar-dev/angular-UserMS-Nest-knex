import { Injectable } from "@nestjs/common";
import Knex from "knex";
import config from "knexfile";
@Injectable()
export class KnexService {
  private KNEX: Knex.Knex;
  constructor() {
    this.KNEX = Knex(config);
  }
  getKnex(): Knex.Knex {
    return this.KNEX;
  }
}
