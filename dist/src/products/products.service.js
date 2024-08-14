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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const knex_service_1 = require("../service/knex.service");
let ProductsService = class ProductsService {
    constructor(knex, jwt) {
        this.knex = knex;
        this.jwt = jwt;
    }
    async createNewProduct(item) {
        try {
            const user = await this.knex
                .getKnex()
                .table('_users')
                .where({ id: item.user_id })
                .first()
                .select(['status', 'role']);
            if (user) {
                if (user.status === 'active') {
                    console.log('from service', user);
                    const result = await this.knex
                        .getKnex()
                        .table('_products')
                        .insert(item)
                        .returning('*');
                    return result;
                }
                else {
                    throw new common_1.UnauthorizedException('Your account is inactive, please contact with admin.');
                }
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async getAllProducts(token) {
        try {
            const query = this.knex.getKnex().table('_products').select('*');
            if (token) {
                const user = await this.jwt.decode(token);
                if (user && user.id) {
                    query.whereNot({ user_id: user.id });
                }
                else {
                    throw new common_1.BadRequestException('Invalid token: User ID is missing.');
                }
            }
            return await query.where({ status: 'available' });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'An error occurred while fetching products.');
        }
    }
    async getAProduct(id) {
        try {
            const result = await this.knex
                .getKnex()
                .table('_products')
                .where({ id })
                .first();
            return result;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async getMyProducts(id) {
        try {
            const result = await this.knex
                .getKnex()
                .table('_products as p')
                .where('p.user_id', id);
            return result;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteAProduct(id) {
        try {
            const result = await this.knex
                .getKnex()
                .table('_products')
                .where({ id })
                .del();
            if (result === 0) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            else
                return result;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async updateMyProduct(updatedData, id) {
        try {
            const result = await this.knex
                .getKnex()
                .table('_products')
                .where({ id })
                .update(updatedData);
            if (result === 0) {
                throw new common_1.NotFoundException(` product ${id} not found`);
            }
            const updatedProduct = await this.knex
                .getKnex()
                .table('_products')
                .where({ id })
                .first();
            return updatedProduct;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knex_service_1.KnexService,
        jwt_1.JwtService])
], ProductsService);
//# sourceMappingURL=products.service.js.map