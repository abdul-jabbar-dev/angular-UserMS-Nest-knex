import { JwtAuthService } from "src/service/jwt.service";
import { AuthUtilsService } from "./../service/auth.utils.service";
import { TUser, TUserResponse, Tlogin } from "./../types/User";
import { BadRequestException, Injectable } from "@nestjs/common";
import { KnexService } from "src/service/knex.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly knexService: KnexService,
    public utils: AuthUtilsService,
    public jwt: JwtAuthService
  ) {}

  async getUsers({
    pageSize,
    page,
    role,
  }: {
    pageSize: string | number;
    page: string | number;
    role?: "admin" | "subscriber";
  }): Promise<{
    data: TUserResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const offset = (Number(page) - 1) * Number(pageSize);

    try {
      const expectResult = this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .orderBy("created_at", "desc")
        .limit(Number(pageSize))
        .offset(offset);
      if (role) {
        expectResult.where({ role });
      }
      const result = await expectResult;

      const totalQuery = this.knexService
        .getKnex()
        .table<TUserResponse>("_users");

      if (role) {
        totalQuery.where("role", role);
      }

      const [total] = await totalQuery.count();
      return {
        data: result,
        total: total,
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      throw new BadRequestException("Could not fetch users");
    }
  }

  async getRiders() {
    try {
      const expectResult = this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ role: "rider" })
        .orderBy("created_at", "desc");

      const result = await expectResult;

      return result;
    } catch (error) {
      throw new BadRequestException("Could not fetch users");
    }
  }

  async getUserById(id: number): Promise<TUserResponse | null> {
    try {
      const result = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ id })
        .first();
      return result || null;
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching user by ID:", error);
      throw new BadRequestException("Could not fetch user");
    }
  }

  async getUserByEmail(email: string): Promise<TUserResponse | null> {
    try {
      const result = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ email })
        .first();
      return result || null;
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching user by ID:", error);
      throw new BadRequestException("Could not fetch user");
    }
  }

  async loginUser(userInfo: Tlogin) {
    try {
      let loginMyUser: { data: TUserResponse; token: string } | null = null;
      const exist: TUserResponse = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ email: userInfo.email })
        .first();

      if (!exist) {
        throw new BadRequestException("User not register");
      } else {
        if (exist.status === "active") {
 
          if (await this.utils.compareHashed(exist.password, userInfo.password)) {
            loginMyUser = {
              data: { ...exist, password: "" },
              token: await this.jwt.generateToken({
                email: exist.email,
                username: exist.username,
                role: exist.role,
                id: exist.id as unknown as string,
              }),
            };
          } else {

            throw new BadRequestException("Invalid Password!");
          }
        } else {
          throw new BadRequestException(
            userInfo.email + " user not active wait for activate"
          );
        }
      }
      return loginMyUser;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException("Could not fetch user");
    }
  }
  async registerUser(
    userInfo: TUser
  ): Promise<{ data: TUserResponse; token: string } | null> {
    let username: string = "";
    let password: string = "";
    let createdUser: TUserResponse;
    try {
      const isExist = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ email: userInfo.email })
        .first();
      if (isExist) {
        throw new BadRequestException("User Already Exist");
      } else {
        username = await this.utils.generateUniqueUsername(
          userInfo.first_name,
          userInfo.last_name
        );
        password = await this.utils.makeHashed(userInfo.password);
        [createdUser] = await this.knexService
          .getKnex()
          .table<TUserResponse>("_users")
          .insert({
            ...userInfo,
            password,
            username,
            role: "subscriber",
            status: "deactive",
          })
          .returning("*");
      }
      if (createdUser) {
        return {
          data: createdUser,
          token: await this.jwt.generateToken({
            email: createdUser.email,
            username: createdUser.username,
            role: createdUser.role,
            id: createdUser.id as unknown as string,
          }),
        };
      } else {
        throw new BadRequestException("Registration failed");
      }
    } catch (error) {
      if (error.constraint) {
        throw new BadRequestException(error.constraint);
      } else if (error.message) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException("Could not fetch user");
      }
    }
  }

  async userStatusUpdate(id: string) {
    try {
      const [{ status }] = await this.knexService
        .getKnex()
        .table("_users")
        .select("status")
        .where({ id });

      const user = await this.knexService
        .getKnex()
        .table("_users")
        .where({ id })
        .update({ status: status === "active" ? "deactive" : "active" });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async userUpdateRole(id: string) {
    try {
      const [{ role, status }] = await this.knexService
        .getKnex()
        .table("_users")
        .select(["role", "status"])
        .where({ id });
      if (status === "active") {
        const user = await this.knexService
          .getKnex()
          .table("_users")
          .where({ id })
          .update({ role: role === "admin" ? "subscriber" : "admin" });
        return user;
      } else {
        throw new Error("User not active");
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async UserDeleteRoute(id: string) {
    try {
      const result = await this.knexService
        .getKnex()
        .table("_users")
        .where({ id })
        .delete();
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async UserProfile(id: string) {
    try {
      const result = await this.knexService
        .getKnex()
        .table("_users")
        .where({ id: id });
      delete result[0].password;
      return result[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async UserUpdateProfile({
    email,
    password,
    user_id,
    username,
    ...userInfo
  }: Partial<TUser & { user_id: any; username: string }>) {
    try {
      const result = await this.knexService
        .getKnex()
        .table("_users")
        .where({ id: user_id })
        .update({ ...userInfo });
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
