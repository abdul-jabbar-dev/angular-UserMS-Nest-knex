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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async myprofile({ user_id }) {
        try {
            return await this.authService.userProfile(user_id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getUsers({ pageSize = 5, page = 1, role, }) {
        return await this.authService.getUsers({ pageSize, page, role });
    }
    async getUser(id) {
        const userId = parseInt(id);
        return await this.authService.getUserById(userId);
    }
    async getRider() {
        return await this.authService.getRiders();
    }
    async getRiderHistory({ user_id }) {
        return await this.authService.getRiderHistory(user_id);
    }
    async registerUser(user) {
        try {
            return await this.authService.registerUser(user);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async loginUser(user) {
        try {
            return await this.authService.loginUser(user);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async sendCodeForReset({ email }) {
        try {
            return await this.authService.sendCodeForReset(email);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async genNewPass(id, password) {
        try {
            return await this.authService.genNewPass(id, password);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateStatus(id) {
        return await this.authService.userStatusUpdate(id);
    }
    async updatePassword({ oldPassword, newPassword, user_id, }) {
        return await this.authService.updatePassword(oldPassword, newPassword, user_id);
    }
    async updateRole(id) {
        return await this.authService.userUpdateRole(id);
    }
    async deleteUser({ user_id }) {
        return await this.authService.userDeleteRoute(user_id);
    }
    async deleteUserByAdmin(id) {
        return await this.authService.userDeleteRoute(id);
    }
    async updateProfile(user) {
        try {
            const result = await this.authService.userUpdateProfile(user);
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("get_my_profile"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "myprofile", null);
__decorate([
    (0, common_1.Get)("get_users"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)("get_user/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)("get_rider"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRider", null);
__decorate([
    (0, common_1.Get)("rider/get_history"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRiderHistory", null);
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)("send_code"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendCodeForReset", null);
__decorate([
    (0, common_1.Post)("send_new_password/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "genNewPass", null);
__decorate([
    (0, common_1.Put)("status_update/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)("update_password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)("role_update/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUserByAdmin", null);
__decorate([
    (0, common_1.Put)("update_profile"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map