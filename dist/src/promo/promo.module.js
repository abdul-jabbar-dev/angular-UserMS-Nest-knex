"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoModule = void 0;
const common_1 = require("@nestjs/common");
const promo_service_1 = require("./promo.service");
const promo_controller_1 = require("./promo.controller");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const jwt_service_1 = require("../service/jwt.service");
const jwt_1 = require("@nestjs/jwt");
const knex_service_1 = require("../service/knex.service");
let PromoModule = class PromoModule {
    configure(consumer) {
        consumer
            .apply(authorization_middleware_1.AuthorizationMiddleware)
            .forRoutes({ path: "promo/create", method: common_1.RequestMethod.POST }, { path: "promo", method: common_1.RequestMethod.GET }, { path: "promo/status/:id", method: common_1.RequestMethod.PUT });
    }
};
exports.PromoModule = PromoModule;
exports.PromoModule = PromoModule = __decorate([
    (0, common_1.Module)({
        controllers: [promo_controller_1.PromoController],
        providers: [promo_service_1.PromoService, jwt_service_1.JwtAuthService, jwt_1.JwtService, knex_service_1.KnexService],
    })
], PromoModule);
//# sourceMappingURL=promo.module.js.map