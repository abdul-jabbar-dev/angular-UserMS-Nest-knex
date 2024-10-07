"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_service_1 = require("../service/jwt.service");
const auth_utils_service_1 = require("./../service/auth.utils.service");
const common_1 = require("@nestjs/common");
const knex_service_1 = require("../service/knex.service");
const mail_service_1 = require("../service/mail.service");
let AuthService = class AuthService {
    constructor(knexService, utils, jwt, sendMail) {
        this.knexService = knexService;
        this.utils = utils;
        this.jwt = jwt;
        this.sendMail = sendMail;
    }
    async getUsers({ pageSize, page, role, }) {
        const offset = (Number(page) - 1) * Number(pageSize);
        try {
            const expectResult = this.knexService
                .getKnex()
                .table("_users")
                .orderBy("created_at", "desc")
                .limit(Number(pageSize))
                .offset(offset);
            if (role) {
                expectResult.where({ role });
            }
            const result = await expectResult;
            const totalQuery = this.knexService
                .getKnex()
                .table("_users");
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
        }
        catch (error) {
            throw new common_1.BadRequestException("Could not fetch users");
        }
    }
    async getRiders() {
        try {
            const expectResult = this.knexService
                .getKnex()
                .table("_users")
                .where({ role: "rider" })
                .orderBy("created_at", "desc");
            const result = await expectResult;
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException("Could not fetch users");
        }
    }
    async getRiderHistory(user_id) {
        try {
            const user = await this.knexService
                .getKnex()
                .table("_users")
                .where({ role: "rider", id: user_id })
                .first();
            if (!user) {
                throw new common_1.BadRequestException("User not found or is not a rider");
            }
            const notDeliveryCount = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ delivery_boy_id: user_id })
                .andWhereNot("delivery_status", "delivery")
                .count("* as totalPending");
            const totalPending = parseInt(notDeliveryCount[0]?.totalPending || "0", 10);
            const totalBenifitResult = await this.knexService
                .getKnex()
                .table("_delivery")
                .leftJoin("_shippingOrder", "_delivery.order_id", "_shippingOrder.id")
                .where({
                "_delivery.delivery_boy_id": user_id,
                "_delivery.delivery_status": "delivery",
            })
                .sum("_shippingOrder.shipping_cost as totalBenifit");
            const totalBenifit = parseFloat(totalBenifitResult[0]?.totalBenifit || "0");
            const totalDoneCount = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ delivery_boy_id: user_id })
                .andWhere("delivery_status", "delivery")
                .count("* as totalDone");
            const totalDone = parseInt(totalDoneCount[0]?.totalDone || "0", 10);
            console.log({ totalDone, totalBenifit, totalPending });
            return { totalDone, totalBenifit, totalPending };
        }
        catch (error) {
            console.error("Error fetching rider history:", error);
            throw new common_1.BadRequestException("Could not fetch rider history");
        }
    }
    async getUserById(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id })
                .first();
            return result || null;
        }
        catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new common_1.BadRequestException("Could not fetch user");
        }
    }
    async getUserByEmail(email) {
        try {
            const result = await this.knexService
                .getKnex()
                .table("_users")
                .where({ email })
                .first();
            return result || null;
        }
        catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new common_1.BadRequestException("Could not fetch user");
        }
    }
    async loginUser(userInfo) {
        try {
            let loginMyUser = null;
            const exist = await this.knexService
                .getKnex()
                .table("_users")
                .where({ email: userInfo.email })
                .first();
            console.log(exist);
            if (!exist) {
                throw new common_1.BadRequestException("User not register");
            }
            else {
                if (exist.status === "active") {
                    if (await this.utils.compareHashed(exist.password, userInfo.password)) {
                        console.log('Password match successfully', userInfo);
                        loginMyUser = {
                            data: { ...exist, password: "" },
                            token: await this.jwt.generateToken({
                                email: exist.email,
                                username: exist.username,
                                role: exist.role,
                                id: exist.id,
                            }),
                        };
                    }
                    else {
                        throw new common_1.BadRequestException("Invalid Password!");
                    }
                }
                else {
                    throw new common_1.BadRequestException(userInfo.email + " user not active wait for activate");
                }
            }
            return loginMyUser;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Could not fetch user");
        }
    }
    async genNewPass(id, { password }) {
        try {
            const exist = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id: Number(id) })
                .first();
            if (!exist) {
                throw new common_1.BadRequestException("User not found");
            }
            else {
                const genNewPass = await this.utils.makeHashed(password);
                if (!genNewPass) {
                    throw new common_1.BadRequestException("Passwor Encryption error");
                }
                else {
                    return await this.knexService
                        .getKnex()
                        .table("_users")
                        .where({ id: Number(id) })
                        .update({ password: genNewPass });
                }
            }
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Could not fetch user");
        }
    }
    async sendCodeForReset(email) {
        try {
            const exist = await this.knexService
                .getKnex()
                .table("_users")
                .where({ email })
                .first();
            if (!exist) {
                throw new common_1.BadRequestException("User not register");
            }
            else {
                const genCode = Math.floor(100000 + Math.random() * 900000);
                const exist = await this.knexService
                    .getKnex()
                    .table("_users")
                    .where({ email })
                    .first()
                    .update({ reset_code: genCode.toString() })
                    .returning("*");
                if (!exist) {
                    throw new common_1.BadRequestException("Reset code generation error");
                }
                const responseMail = await this.sendMail.sendResetPasswordMail("abdul.jabbar.dev@gmail.com", "abdul jabbar", genCode.toString());
                if (!responseMail.messageId) {
                    throw new common_1.BadRequestException("Reset code ");
                }
                else {
                    return exist;
                }
            }
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Could not fetch user");
        }
    }
    async registerUser(userInfo) {
        let username = "";
        let password = "";
        let createdUser;
        try {
            const isExist = await this.knexService
                .getKnex()
                .table("_users")
                .where({ email: userInfo.email })
                .first();
            if (isExist) {
                throw new common_1.BadRequestException("User Already Exist");
            }
            else {
                username = await this.utils.generateUniqueUsername(userInfo.first_name, userInfo.last_name);
                password = await this.utils.makeHashed(userInfo.password);
                [createdUser] = await this.knexService
                    .getKnex()
                    .table("_users")
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
                        id: createdUser.id,
                    }),
                };
            }
            else {
                throw new common_1.BadRequestException("Registration failed");
            }
        }
        catch (error) {
            if (error.constraint) {
                throw new common_1.BadRequestException(error.constraint);
            }
            else if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            else {
                throw new common_1.BadRequestException("Could not fetch user");
            }
        }
    }
    async userStatusUpdate(id) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async userUpdateRole(id) {
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
                    role: role === "admin"
                        ? "subscriber"
                        : role === "rider"
                            ? "admin"
                            : "rider",
                });
                return user;
            }
            else {
                throw new Error("User not active");
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async userDeleteRoute(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id })
                .delete();
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async userProfile(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id: id });
            delete result[0].password;
            return result[0];
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async userUpdateProfile({ new_password, age, first_name, last_name, user_id, phone, }) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updatePassword(oldPassword, newPassword, user_id) {
        try {
            const user = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id: Number(user_id) })
                .returning("*")
                .first();
            if (!user) {
                throw new common_1.UnauthorizedException("User not exist");
            }
            else {
                const comparePassword = await this.utils.compareHashed(user.password, oldPassword);
                if (!comparePassword) {
                    throw new common_1.UnprocessableEntityException("Password didn't match");
                }
                else {
                    const dyc_new_password = await this.utils.makeHashed(newPassword);
                    const result = await this.knexService
                        .getKnex()
                        .table("_users")
                        .where({ id: user.id })
                        .first()
                        .update({
                        password: dyc_new_password,
                    })
                        .returning("id");
                    return result;
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteUser(oldPassword, newPassword, user_id) {
        try {
            const user = await this.knexService
                .getKnex()
                .table("_users")
                .where({ id: Number(user_id) })
                .returning("*")
                .first();
            if (!user) {
                throw new common_1.UnauthorizedException("User not exist");
            }
            else {
                const comparePassword = await this.utils.compareHashed(user.password, oldPassword);
                if (!comparePassword) {
                    throw new common_1.UnprocessableEntityException("Password didn't match");
                }
                else {
                    const dyc_new_password = await this.utils.makeHashed(newPassword);
                    const result = await this.knexService
                        .getKnex()
                        .table("_users")
                        .where({ id: user.id })
                        .first()
                        .update({
                        password: dyc_new_password,
                    })
                        .returning("id");
                    return result;
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knex_service_1.KnexService,
        auth_utils_service_1.AuthUtilsService,
        jwt_service_1.JwtAuthService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map