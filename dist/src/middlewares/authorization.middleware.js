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
exports.AuthorizationMiddleware = void 0;
const jwt_service_1 = require("../service/jwt.service");
const common_1 = require("@nestjs/common");
let AuthorizationMiddleware = class AuthorizationMiddleware {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async use(req, res, next) {
        try {
            if (req.headers.authorization) {
                let token = req.headers.authorization;
                if (token.includes("Bearer")) {
                    token = req.headers.authorization.split(" ")[1];
                }
                const user = await this.jwt.decryptToken(token);
                if (user?.role === "admin" ||
                    req.route.path === "/product/create" ||
                    req.route.path === "/shipping" ||
                    req.route.path === "/user/get_my_profile" ||
                    req.route.path === "/user/get_user/:id" ||
                    req.route.path === "/shipping/get_rider_order" ||
                    req.route.path === "/shipping/:product_id" ||
                    req.route.path === "/shipping/confirm_delivery/:orderId" ||
                    req.route.path === "/shipping/confirm_rider/:order_id" ||
                    req.route.path === "/user/rider/get_history" ||
                    req.route.path === "/user/delete" ||
                    req.route.path === "/user/update_password" ||
                    req.route.path === "/shipping/confirm" ||
                    req.route.path === "/product/my_products" ||
                    req.route.path === "/user/update_profile") {
                    req.body.user_id = user.id;
                    next();
                }
                else {
                    throw new common_1.UnauthorizedException("Unauthorized! Admin can handle.");
                }
            }
            else {
                throw new common_1.UnauthorizedException("Login Required!");
            }
        }
        catch (error) {
            if (error.response.message === "Login Required!") {
                throw new common_1.UnauthorizedException("Login Required!");
            }
            throw new common_1.UnauthorizedException(error);
        }
    }
};
exports.AuthorizationMiddleware = AuthorizationMiddleware;
exports.AuthorizationMiddleware = AuthorizationMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], AuthorizationMiddleware);
//# sourceMappingURL=authorization.middleware.js.map