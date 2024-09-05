"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const jwt_service_1 = require("../service/jwt.service");
const jwt_1 = require("@nestjs/jwt");
const knex_service_1 = require("../service/knex.service");
let OrderModule = class OrderModule {
    configure(consumer) {
        consumer
            .apply(authorization_middleware_1.AuthorizationMiddleware)
            .forRoutes({ path: "order", method: common_1.RequestMethod.POST });
    }
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService, knex_service_1.KnexService, jwt_service_1.JwtAuthService, jwt_1.JwtService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map