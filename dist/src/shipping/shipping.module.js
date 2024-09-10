"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingModule = void 0;
const common_1 = require("@nestjs/common");
const shipping_service_1 = require("./shipping.service");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const knex_service_1 = require("../service/knex.service");
const jwt_service_1 = require("../service/jwt.service");
const jwt_1 = require("@nestjs/jwt");
const promo_service_1 = require("../promo/promo.service");
const shipping_controller_1 = require("./shipping.controller");
let ShippingModule = class ShippingModule {
    configure(consumer) {
        consumer
            .apply(authorization_middleware_1.AuthorizationMiddleware)
            .forRoutes({ path: "shipping", method: common_1.RequestMethod.POST }, { path: "shipping", method: common_1.RequestMethod.GET }, { path: "shipping/get_rider_order", method: common_1.RequestMethod.GET }, { path: "shipping/add_rider", method: common_1.RequestMethod.POST }, { path: "shipping/confirm_rider/:order_id", method: common_1.RequestMethod.PUT }, { path: "shipping/confirm", method: common_1.RequestMethod.POST }, { path: "shipping/all", method: common_1.RequestMethod.GET }, {
            path: "shipping/confirm_delivery/:orderId",
            method: common_1.RequestMethod.PUT,
        });
    }
};
exports.ShippingModule = ShippingModule;
exports.ShippingModule = ShippingModule = __decorate([
    (0, common_1.Module)({
        controllers: [shipping_controller_1.ShippingController],
        providers: [
            shipping_service_1.ShippingService,
            knex_service_1.KnexService,
            jwt_service_1.JwtAuthService,
            jwt_1.JwtService,
            promo_service_1.PromoService,
        ],
    })
], ShippingModule);
//# sourceMappingURL=shipping.module.js.map