import ENV  from 'src/util/ENV';
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { KnexService } from "./knex.service";
import { TUserResponse } from "src/types/User";
@Injectable()
export class AuthUtilsService {
  constructor(private readonly knexService: KnexService) {}
  private solt = ENV.SOLT;
  async makeHashed(pass: string) {
    return await hash(pass, this.solt);
  }
  async compareHashed(hashedPass: string, newPass: string) {
    return await compare(newPass, hashedPass);
  }
  async generateUniqueUsername(
    firstName: string,
    lastName: string
  ): Promise<string> {
    let username: string;
    let isUnique: boolean = false;

    while (!isUnique) {
      username = `${firstName?.toLowerCase()}${lastName?.toLowerCase()}${uuidv4().slice(0, 3)}`;

      const existingUser = await this.knexService
        .getKnex()
          .table<TUserResponse>("_users")
        .where({ username })
        .first();

      if (!existingUser) {
        isUnique = true;
      }
    }

    return username;
  }
}
