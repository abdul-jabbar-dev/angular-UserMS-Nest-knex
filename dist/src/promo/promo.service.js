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
exports.PromoService = void 0;
const knex_service_1 = require("./../service/knex.service");
const common_1 = require("@nestjs/common");
let PromoService = class PromoService {
    constructor(knex) {
        this.knex = knex;
    }
    async create(user_id, createPromo) {
        try {
            const [result] = await this.knex
                .getKnex()
                .table("_promocode")
                .insert({
                ...createPromo,
                is_active: false,
                author_id: user_id,
                code: createPromo.code.toUpperCase(),
            })
                .returning("*");
            return result;
        }
        catch (error) {
            if (error.constraint === "_promocode_code_unique") {
                throw new common_1.HttpException({ message: "Promo code already exists" }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({ message: "An error occurred while creating the promocode" }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(pageSize, page) {
        const offset = (Number(page) - 1) * Number(pageSize);
        try {
            const result = await this.knex
                .getKnex()
                .table("_promocode")
                .select("*")
                .orderBy("created_at", "desc")
                .limit(Number(pageSize))
                .offset(offset);
            const currentDate = new Date();
            const processedResult = result.map((promo) => ({
                ...promo,
                is_expire: new Date(promo.valid_to) < currentDate,
            }));
            const totalQuery = this.knex
                .getKnex()
                .table("_promocode");
            const [{ count: total }] = await totalQuery.count("*");
            return {
                data: processedResult,
                total: Number(total),
                page: Number(page),
                pageSize: Number(pageSize),
            };
        }
        catch (error) {
            throw new common_1.HttpException({ message: "An error occurred while retrieving promocodes" }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async for_users() {
        try {
            const currentDate = new Date();
            const result = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ is_active: true, visible: "public" })
                .andWhere("valid_to", ">=", currentDate)
                .select("*");
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ message: "An error occurred while retrieving promocodes" }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyCode(code) {
        try {
            const promocode = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ code })
                .first();
            if (!promocode) {
                throw new common_1.HttpException({ message: "Invalid promocode" }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promocode.is_active) {
                throw new common_1.HttpException({ message: "Inactive promocode" }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (promocode.usage_limit <= promocode.times_used) {
                throw new common_1.HttpException({ message: "Promocode usage limit reached" }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (new Date(promocode.valid_to) < new Date()) {
                throw new common_1.HttpException({ message: "Promocode expired" }, common_1.HttpStatus.BAD_REQUEST);
            }
            return promocode;
        }
        catch (error) {
            if (error.message) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(id) {
        try {
            const promocode = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .select("*")
                .first();
            if (!promocode) {
                throw new common_1.HttpException({ message: "Promocode does not exist" }, common_1.HttpStatus.NOT_FOUND);
            }
            return promocode;
        }
        catch (error) {
            throw new common_1.HttpException("An error occurred while retrieving the promocode", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updatePromoDto) {
        try {
            const [updated] = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .update(updatePromoDto)
                .returning("*");
            if (!updated) {
                throw new common_1.HttpException("Promocode does not exist", common_1.HttpStatus.NOT_FOUND);
            }
            return updated;
        }
        catch (error) {
            throw new common_1.HttpException("An error occurred while updating the promocode", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async toggleState(id) {
        try {
            const promocode = await this.findOne(id);
            const updatedPromocode = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .update({ is_active: !promocode.is_active })
                .returning("*");
            return updatedPromocode;
        }
        catch (error) {
            throw new common_1.HttpException({ message: "An error occurred while toggling the promocode state" }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async toggleVisibility(id) {
        try {
            const promocode = await this.findOne(id);
            const updatedPromocode = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .update({
                visible: promocode.visible === "public" ? "private" : "public",
            })
                .returning("*");
            return updatedPromocode;
        }
        catch (error) {
            throw new common_1.HttpException({ message: "An error occurred while toggling the promocode state" }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async usePromocode(id) {
        try {
            const promocode = await this.findOne(id);
            if (!promocode.is_active) {
                throw new common_1.HttpException({ message: "Inactive promocode" }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (promocode.usage_limit <= promocode.times_used) {
                throw new common_1.HttpException({ message: "Promocode usage limit reached" }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (new Date(promocode.valid_to) < new Date()) {
                throw new common_1.HttpException({ message: "Promocode expired" }, common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .increment("times_used", 1)
                .returning("*")[0];
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const deletedCount = await this.knex
                .getKnex()
                .table("_promocode")
                .where({ id })
                .del();
            if (!deletedCount) {
                throw new common_1.HttpException("Promocode does not exist", common_1.HttpStatus.NOT_FOUND);
            }
            return { message: "Promocode removed successfully" };
        }
        catch (error) {
            throw new common_1.HttpException("An error occurred while removing the promocode", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PromoService = PromoService;
exports.PromoService = PromoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knex_service_1.KnexService])
], PromoService);
//# sourceMappingURL=promo.service.js.map