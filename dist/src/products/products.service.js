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
                .table("_users")
                .where({ id: item.user_id })
                .first()
                .select(["status", "role"]);
            if (user) {
                if (user.status === "active") {
                    const result = await this.knex
                        .getKnex()
                        .table("_products")
                        .insert(item)
                        .returning("*");
                    return result;
                }
                else {
                    throw new common_1.UnauthorizedException("Your account is inactive, please contact with admin.");
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
    async getAllProducts(token, searchQuery) {
        try {
            const query = this.knex
                .getKnex()
                .table("_products")
                .where({ status: "available" });
            if (token) {
                const user = await this.jwt.decode(token);
                if (user && user.id) {
                    query.whereNot({ user_id: user.id });
                }
                else {
                    throw new common_1.BadRequestException("Invalid token: User ID is missing.");
                }
            }
            if (searchQuery) {
                let [SF, SV] = searchQuery.split(":");
                query
                    .whereRaw(`LOWER(${SF}) LIKE ?`, [`${SV.toLowerCase()}%`])
                    .select("id", "title");
            }
            return await query;
        }
        catch (error) {
            if (error?.message && searchQuery?.split(":").length) {
                let [SF] = searchQuery?.split(":");
                if (SF && error.message.includes(`column "${SF}" does not exist`)) {
                    return [];
                }
            }
            throw new common_1.BadRequestException(error.message || "An error occurred while fetching products.");
        }
    }
    async getAllProductsAdmin(pageSize, page) {
        const offset = (Number(page) - 1) * Number(pageSize);
        try {
            const expectResult = this.knex
                .getKnex()
                .table("_products")
                .orderBy("created_at", "desc")
                .limit(Number(pageSize))
                .offset(offset);
            const result = await expectResult;
            const totalQuery = this.knex
                .getKnex()
                .table("_products");
            const [total] = await totalQuery.count();
            return {
                data: result,
                total: total,
                page: Number(page),
                pageSize: Number(pageSize),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Could not fetch products");
        }
    }
    async getAProduct(id) {
        try {
            const result = await this.knex
                .getKnex()
                .table("_products")
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
    async getMyProducts(userId, query) {
        try {
            let result = this.knex
                .getKnex()
                .table("_products as p")
                .leftJoin("_shippingOrder as s", "p.id", "s.product_id")
                .leftJoin("_users as u", "s.user_id", "u.id")
                .select("p.*", "s.order_number", "u.id as order_user_id", "u.username as order_user_name")
                .where("p.user_id", userId);
            const filter = JSON?.parse(query?.filter);
            let all = await result;
            const groupCount = all.reduce((acc, current) => {
                if (!acc[current["status"]]) {
                    acc[current["status"]] = 0;
                }
                acc[current["status"]]++;
                return acc;
            }, {});
            if (filter.length > 0) {
                all = all.filter((item) => filter.includes(item.status));
            }
            return { data: all, group: groupCount };
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
                .table("_products")
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
                .table("_products")
                .where({ id })
                .update(updatedData);
            if (result === 0) {
                throw new common_1.NotFoundException(` product ${id} not found`);
            }
            const updatedProduct = await this.knex
                .getKnex()
                .table("_products")
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