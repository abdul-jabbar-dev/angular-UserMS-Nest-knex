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
exports.ShippingService = void 0;
const knex_service_1 = require("../service/knex.service");
const common_1 = require("@nestjs/common");
let ShippingService = class ShippingService {
    constructor(knexService) {
        this.knexService = knexService;
    }
    async create(createShipping) {
        try {
            const data = {
                user_id: createShipping.user_id,
                product_id: Number(createShipping.product.id),
                shipping_cost: Number(createShipping.bill.cost),
                shipping_zone: createShipping.bill.spot,
                shipping_email: createShipping.address.email,
                shipping_phone: createShipping.address.phone,
                city: createShipping.address.city,
                address_line1: createShipping.address.addressLine1,
                country: createShipping.address.country,
                state: createShipping.address.state,
                zip: createShipping.address.zip,
                address_line2: createShipping.address.addressLine2,
            };
            const result = await this.knexService
                .getKnex()
                .table("_shippingOrder")
                .insert(data);
            if (result) {
                const updateProductState = await this.knexService
                    .getKnex()
                    .table("_products")
                    .where({ id: data.product_id })
                    .update({ status: "sold" });
                return updateProductState;
            }
            else {
                throw new common_1.UnprocessableEntityException("Shopping Order failed");
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException(error);
        }
    }
    findAll() {
        return `This action returns all shipping`;
    }
    findOne(id) {
        return `This action returns a #${id} shipping`;
    }
    update(id, updateShippingDto) {
        return `This action updates a #${id} shipping`;
    }
    remove(id) {
        return `This action removes a #${id} shipping`;
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knex_service_1.KnexService])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map