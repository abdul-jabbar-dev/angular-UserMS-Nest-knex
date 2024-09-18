import { JwtAuthService } from "src/service/jwt.service";
import { AuthUtilsService } from "./../service/auth.utils.service";
import { TUser, TUserResponse, Tlogin } from "./../types/User";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { KnexService } from "src/service/knex.service";
import { MailService } from "src/service/mail.service";
export interface UserLoginInfo {
  user_id: number;
  userAgent: string | null;
  device_id: string | null;
  latitude: number | null;
  longitude: number | null;
  platform: string | null;
  location: string | null;
}
export interface UserLoginInfoResponse {
  id: number;
  user_id: string | null;
  login_at: Date;
  userAgent: string | null;
  device_id: string | null;
  created_at: Date;
  updated_at: Date;
  latitude: number | null;
  longitude: number | null;
  platform: string | null;
  location: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly knexService: KnexService,
    public utils: AuthUtilsService,
    public jwt: JwtAuthService,
    public sendMail: MailService
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
  async getRiderHistory(user_id: number) {
    try {
      const user = await this.knexService
        .getKnex()
        .table("_users")
        .where({ role: "rider", id: user_id })
        .first();

      if (!user) {
        throw new BadRequestException("User not found or is not a rider");
      }

      const notDeliveryCount = await this.knexService
        .getKnex()
        .table("_delivery")
        .where({ delivery_boy_id: user_id })
        .andWhereNot("delivery_status", "delivery")
        .count("* as totalPending");

      const totalPending = parseInt(
        notDeliveryCount[0]?.totalPending || "0",
        10
      );
      const totalBenifitResult = await this.knexService
        .getKnex()
        .table("_delivery")
        .leftJoin("_shippingOrder", "_delivery.order_id", "_shippingOrder.id")
        .where({
          "_delivery.delivery_boy_id": user_id,
          "_delivery.delivery_status": "delivery",
        })
        .sum("_shippingOrder.shipping_cost as totalBenifit");

      const totalBenifit = parseFloat(
        totalBenifitResult[0]?.totalBenifit || "0"
      );
      const totalDoneCount = await this.knexService
        .getKnex()
        .table("_delivery")
        .where({ delivery_boy_id: user_id })
        .andWhere("delivery_status", "delivery")
        .count("* as totalDone");

      const totalDone = parseInt(totalDoneCount[0]?.totalDone || "0", 10);

      console.log({ totalDone, totalBenifit, totalPending });

      return { totalDone, totalBenifit, totalPending };
    } catch (error) {
      console.error("Error fetching rider history:", error);
      throw new BadRequestException("Could not fetch rider history");
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

  async loginUser(userInfo: { email: string; password: string; meta: any }) {
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
          if (
            await this.utils.compareHashed(exist.password, userInfo.password)
          ) {
            if (userInfo.meta["exist"] && userInfo.meta["storeDevId"]) {
              const { exist, storeDevId } = userInfo.meta;
              const permit = await this.knexService
                .getKnex()
                .table("_users_login_for")
                .where({ device_id: storeDevId })
                .first()
                .returning("*");
            } else {
              console.log(userInfo.meta);
              const { address, deviceId, userAgent, platform } =
                userInfo.meta.deviceInfo;
              const permit = await this.knexService
                .getKnex()
                .table<UserLoginInfo>("_users_login_for")
                .insert({
                  location: address,
                  device_id: deviceId,
                  platform,
                  userAgent,
                  user_id: exist.id,
                })
                .returning("*");
            }

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
  async genNewPass(id: string, { password }) {
    try {
      const exist: TUserResponse = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ id: Number(id) })
        .first();

      if (!exist) {
        throw new BadRequestException("User not found");
      } else {
        const genNewPass = await this.utils.makeHashed(password);
        if (!genNewPass) {
          throw new BadRequestException("Passwor Encryption error");
        } else {
          return await this.knexService
            .getKnex()
            .table<TUserResponse>("_users")
            .where({ id: Number(id) })
            .update({ password: genNewPass });
        }
      }
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException("Could not fetch user");
    }
  }
  async sendCodeForReset(email: string) {
    try {
      const exist: TUserResponse = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ email })
        .first();

      if (!exist) {
        throw new BadRequestException("User not register");
      } else {
        const genCode = Math.floor(100000 + Math.random() * 900000);
        const exist = await this.knexService
          .getKnex()
          .table<TUserResponse>("_users")
          .where({ email })
          .first()
          .update({ reset_code: genCode.toString() })
          .returning("*");
        if (!exist) {
          throw new BadRequestException("Reset code generation error");
        }
        const responseMail = await this.sendMail.sendResetPasswordMail(
          "abdul.jabbar.dev@gmail.com",
          "abdul jabbar",
          genCode.toString()
        );
        if (!responseMail.messageId) {
          throw new BadRequestException("Reset code ");
        } else {
          return exist;
        }
      }
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
      console.log(role, status);
      if (status === "active") {
        const user = await this.knexService
          .getKnex()
          .table("_users")
          .where({ id })
          .update({
            role:
              role === "admin"
                ? "subscriber"
                : role === "rider"
                  ? "admin"
                  : "rider",
          });
        return user;
      } else {
        throw new Error("User not active");
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async userDeleteRoute(id: string) {
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

  async userProfile(id: string) {
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

  async userUpdateProfile({
    new_password,
    age,
    first_name,
    last_name,
    user_id,
    phone,
  }: Partial<
    TUser & { user_id: any; username: string; new_password?: string }
  >) {
    try {
      if (new_password) {
        const dyc_new_password = await this.utils.makeHashed(new_password);
        new_password = dyc_new_password;
      }
      const result = await this.knexService
        .getKnex()
        .table("_users")
        .where({ id: user_id })
        .update({ age, first_name, last_name, phone, password: new_password });
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePassword(
    oldPassword: string,
    newPassword: string,
    user_id: string | number
  ) {
    try {
      const user: TUserResponse = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ id: Number(user_id) })
        .returning("*")
        .first();
      if (!user) {
        throw new UnauthorizedException("User not exist");
      } else {
        const comparePassword = await this.utils.compareHashed(
          user.password,
          oldPassword
        );
        if (!comparePassword) {
          throw new UnprocessableEntityException("Password didn't match");
        } else {
          const dyc_new_password = await this.utils.makeHashed(newPassword);
          const result = await this.knexService
            .getKnex()
            .table<TUserResponse>("_users")
            .where({ id: user.id })
            .first()
            .update({
              password: dyc_new_password,
            })
            .returning("id");
          return result;
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteUser(
    oldPassword: string,
    newPassword: string,
    user_id: string | number
  ) {
    try {
      const user: TUserResponse = await this.knexService
        .getKnex()
        .table<TUserResponse>("_users")
        .where({ id: Number(user_id) })
        .returning("*")
        .first();
      if (!user) {
        throw new UnauthorizedException("User not exist");
      } else {
        const comparePassword = await this.utils.compareHashed(
          user.password,
          oldPassword
        );
        if (!comparePassword) {
          throw new UnprocessableEntityException("Password didn't match");
        } else {
          const dyc_new_password = await this.utils.makeHashed(newPassword);
          const result = await this.knexService
            .getKnex()
            .table<TUserResponse>("_users")
            .where({ id: user.id })
            .first()
            .update({
              password: dyc_new_password,
            })
            .returning("id");
          return result;
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
