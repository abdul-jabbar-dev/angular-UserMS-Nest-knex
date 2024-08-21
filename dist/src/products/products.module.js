"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const knex_service_1 = require("../service/knex.service");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const jwt_service_1 = require("../service/jwt.service");
let ProductsModule = class ProductsModule {
    configure(consumer) {
        consumer
            .apply(authorization_middleware_1.AuthorizationMiddleware)
            .forRoutes({ path: 'product/create', method: common_1.RequestMethod.POST }, { path: 'product/my_products', method: common_1.RequestMethod.GET });
    }
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService, knex_service_1.KnexService, jwt_service_1.JwtAuthService, jwt_1.JwtService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map