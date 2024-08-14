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
let AuthService = class AuthService {
    constructor(knexService, utils, jwt) {
        this.knexService = knexService;
        this.utils = utils;
        this.jwt = jwt;
    }
    async getUsers({ pageSize, page, role, }) {
        const offset = (Number(page) - 1) * Number(pageSize);
        try {
            const expectResult = this.knexService
                .getKnex()
                .table('_users')
                .orderBy('created_at', 'desc')
                .limit(Number(pageSize))
                .offset(offset);
            if (role) {
                expectResult.where({ role });
            }
            const result = await expectResult;
            const totalQuery = this.knexService
                .getKnex()
                .table('_users');
            if (role) {
                totalQuery.where('role', role);
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
            throw new common_1.BadRequestException('Could not fetch users');
        }
    }
    async getUserById(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table('_users')
                .where({ id })
                .first();
            return result || null;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new common_1.BadRequestException('Could not fetch user');
        }
    }
    async getUserByEmail(email) {
        try {
            const result = await this.knexService
                .getKnex()
                .table('_users')
                .where({ email })
                .first();
            return result || null;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new common_1.BadRequestException('Could not fetch user');
        }
    }
    async loginUser(userInfo) {
        try {
            let loginMyUser = null;
            const exist = await this.knexService
                .getKnex()
                .table('_users')
                .where({ email: userInfo.email })
                .first();
            if (!exist) {
                throw new common_1.BadRequestException('User not register');
            }
            else {
                if (await this.utils.compareHashed(exist.password, userInfo.password)) {
                    loginMyUser = {
                        data: { ...exist, password: '' },
                        token: await this.jwt.generateToken({
                            email: exist.email,
                            username: exist.username,
                            role: exist.role,
                            id: exist.id,
                        }),
                    };
                }
                else {
                    throw new common_1.BadRequestException('Invalid Password!');
                }
            }
            return loginMyUser;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException('Could not fetch user');
        }
    }
    async registerUser(userInfo) {
        let username = '';
        let password = '';
        let createdUser;
        try {
            console.log(userInfo);
            const isExist = await this.knexService
                .getKnex()
                .table('_users')
                .where({ email: userInfo.email })
                .first();
            if (isExist) {
                throw new common_1.BadRequestException('User Already Exist');
            }
            else {
                username = await this.utils.generateUniqueUsername(userInfo.first_name, userInfo.last_name);
                password = await this.utils.makeHashed(userInfo.password);
                [createdUser] = await this.knexService
                    .getKnex()
                    .table('_users')
                    .insert({
                    ...userInfo,
                    password,
                    username,
                    role: 'subscriber',
                    status: 'deactive',
                })
                    .returning('*');
            }
            if (createdUser) {
                console.log(createdUser);
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
                throw new common_1.BadRequestException('Registration failed');
            }
        }
        catch (error) {
            console.log(error);
            if (error.constraint) {
                throw new common_1.BadRequestException(error.constraint);
            }
            else if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            else {
                throw new common_1.BadRequestException('Could not fetch user');
            }
        }
    }
    async userStatusUpdate(id) {
        try {
            const [{ status }] = await this.knexService
                .getKnex()
                .table('_users')
                .select('status')
                .where({ id });
            const user = await this.knexService
                .getKnex()
                .table('_users')
                .where({ id })
                .update({ status: status === 'active' ? 'deactive' : 'active' });
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
                .table('_users')
                .select(['role', 'status'])
                .where({ id });
            if (status === 'active') {
                const user = await this.knexService
                    .getKnex()
                    .table('_users')
                    .where({ id })
                    .update({ role: role === 'admin' ? 'subscriber' : 'admin' });
                return user;
            }
            else {
                throw new Error('User not active');
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async UserDeleteRoute(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table('_users')
                .where({ id })
                .delete();
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async UserProfile(id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table('_users')
                .where({ id: id });
            delete result[0].password;
            return result[0];
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async UserUpdateProfile({ email, password, user_id, username, ...userInfo }) {
        try {
            const result = await this.knexService
                .getKnex()
                .table('_users')
                .where({ id: user_id })
                .update({ ...userInfo });
            return result;
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
        jwt_service_1.JwtAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map