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
const promo_service_1 = require("./../promo/promo.service");
const knex_service_1 = require("../service/knex.service");
const common_1 = require("@nestjs/common");
let ShippingService = class ShippingService {
    constructor(knexService, promoService) {
        this.knexService = knexService;
        this.promoService = promoService;
    }
    async addPromo(id, promoId) {
        try {
            const promo = await this.promoService.verifyCode(promoId.promocode_id);
            const result = await this.knexService
                .getKnex()
                .table("_shippingOrder")
                .where({ id })
                .update({ promocode_id: promo.id })
                .returning("*");
            if (result.length > 0) {
                await this.promoService.usePromocode(promo.id);
                return result[0];
            }
            else {
                throw new Error("No rows were updated");
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async create(createShipping) {
        try {
            const exist = await this.knexService
                .getKnex()
                .table("_shippingOrder")
                .where({
                product_id: createShipping.product.id,
                user_id: createShipping.user_id,
            })
                .first();
            if (exist) {
                return exist;
            }
            else {
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
                    product_price: createShipping.product.price,
                    state: createShipping.address.state,
                    zip: createShipping.address.zip,
                    address_line2: createShipping.address.addressLine2,
                    order_status: "pending",
                };
                if (createShipping.promocode_id) {
                    const promo = await this.promoService.verifyCode(createShipping.promocode_id);
                    if (promo) {
                        data["promocode_id"] = promo.id;
                    }
                }
                const orderId = await this.knexService
                    .getKnex()
                    .table("_shippingOrder")
                    .insert(data)
                    .returning("*");
                if (!orderId) {
                    throw new common_1.UnprocessableEntityException("Shopping Order failed");
                }
                else {
                    if (data.promocode_id) {
                        await this.promoService.usePromocode(data.promocode_id);
                    }
                    return orderId;
                }
            }
        }
        catch (error) {
            if (error.message) {
                throw new common_1.UnprocessableEntityException(error.message);
            }
            else {
                throw new common_1.UnprocessableEntityException(error);
            }
        }
    }
    async addrider(createShipping) {
        try {
            const order = await this.knexService
                .getKnex()
                .table("_shippingOrder")
                .where({ order_number: createShipping.order_number })
                .select("*")
                .first();
            const exist = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ "_delivery.order_id": order.id })
                .join("_users", "_delivery.delivery_boy_id", "=", "_users.id")
                .select("_delivery.*", "_users.username as delivery_boy_name", "_users.email as delivery_boy_email")
                .first();
            if (exist) {
                return { ...exist, order_id: order.id };
            }
            const [assignRider] = await this.knexService
                .getKnex()
                .table("_delivery")
                .insert({
                delivery_status: "packaging",
                delivery_boy_id: createShipping.selected_rider,
                order_id: order.id,
            })
                .returning("*");
            return { ...assignRider, order_id: order.id };
        }
        catch (error) {
            console.log(error);
            if (error.message) {
                throw new common_1.UnprocessableEntityException(error.message);
            }
            else {
                throw new common_1.UnprocessableEntityException(error);
            }
        }
    }
    async confirmPayment(createShipping) {
        try {
            const knex = this.knexService.getKnex();
            await knex.transaction(async (trx) => {
                const product = await trx("_shippingOrder")
                    .where({ order_number: createShipping.orderNumber })
                    .first();
                await trx("_shippingOrder")
                    .where({
                    order_number: createShipping.orderNumber,
                    user_id: createShipping.user_id,
                })
                    .update({
                    order_status: "paid",
                });
                await trx("_products").where({ id: product.product_id }).update({
                    status: "sold",
                });
            });
            return "Product Placed Successfully";
        }
        catch (error) {
            console.error("Error updating tables:", error);
        }
    }
    async findAll(user_id) {
        try {
            const result = await this.knexService
                .getKnex()
                .select("_shippingOrder.*", "_promocode.*", "_products.*", "_delivery.*", "_shippingOrder.created_at as shipping_order_created_at", "_shippingOrder.id as order_id")
                .from("_shippingOrder")
                .leftJoin("_delivery", "_delivery.order_id", "_shippingOrder.id")
                .leftJoin("_promocode", "_shippingOrder.promocode_id", "_promocode.id")
                .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
                .where("_shippingOrder.user_id", user_id);
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    }
    async findAllOrderAdmin() {
        try {
            const result = await this.knexService
                .getKnex()
                .select("_shippingOrder.*", "_promocode.*", "_products.*", "_delivery.*", "_users.username as delivery_boy_name", "_delivery.delivery_status", "_shippingOrder.created_at as shipping_order_created_at", "_shippingOrder.id as order_id")
                .from("_shippingOrder")
                .leftJoin("_promocode", "_shippingOrder.promocode_id", "_promocode.id")
                .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
                .leftJoin("_delivery", "_delivery.order_id", "_shippingOrder.id")
                .leftJoin("_users", "_users.id", "_delivery.delivery_boy_id");
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    }
    async findAllOrderRider(user_id) {
        try {
            const result = await this.knexService
                .getKnex()
                .select("_shippingOrder.*", "_delivery.*", "_shippingOrder.created_at as shipping_order_created_at", "_shippingOrder.id as order_id", "_users.username as receiver_username", "_users.first_name as receiver_first_name", "_users.last_name as receiver_last_name", "_delivery.id as delivery_id")
                .from("_delivery")
                .leftJoin("_shippingOrder", "_delivery.order_id", "_shippingOrder.id")
                .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
                .leftJoin("_users", "_shippingOrder.user_id", "_users.id")
                .where("_delivery.delivery_boy_id", user_id);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async findAOrderRider(user_id, order_id) {
        try {
            const result = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ delivery_boy_id: user_id, order_id: order_id })
                .first()
                .returning("*");
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            console.log(id);
            const result = await this.knexService
                .getKnex()
                .table("_shippingOrder")
                .select("_shippingOrder.*", "_promocode.*", "_products.*", "_users.id", "_users.first_name", "_users.last_name", "_users.phone", "_users.username", "_shippingOrder.id  as order_id", "_users.email", "_delivery.*", "_shippingOrder.id as order_id", "_shippingOrder.created_at as shipping_order_created_at", "_shippingOrder.updated_at as shipping_updated_at")
                .from("_shippingOrder")
                .leftJoin("_promocode", "_shippingOrder.promocode_id", "_promocode.id")
                .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
                .leftJoin("_users", "_shippingOrder.user_id", "_users.id")
                .leftJoin("_delivery", "_delivery.order_id", "_shippingOrder.id")
                .where("_delivery.id", id)
                .first();
            console.log(result);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async rider_confirm(delivery) {
        try {
            const genCode = Math.floor(100000 + Math.random() * 900000);
            const [result] = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ id: delivery.id })
                .update({
                delivery_status: "transit",
                delivery_received_code: genCode,
            })
                .returning("*");
            return "result";
        }
        catch (error) {
            throw error;
        }
    }
    async confirmDelivery(id, code) {
        try {
            const exist = await this.knexService
                .getKnex()
                .table("_delivery")
                .where({ id })
                .select("*")
                .first();
            if (!exist) {
                throw new common_1.ServiceUnavailableException("Order does not exist");
            }
            else {
                if (exist?.delivery_received_code + "" === code + "") {
                    const [result] = await this.knexService
                        .getKnex()
                        .table("_delivery")
                        .where({ id })
                        .update({
                        delivery_status: "delivery",
                    })
                        .returning("*");
                    return result;
                }
                else {
                    throw new common_1.UnprocessableEntityException("Invalid code");
                }
            }
        }
        catch (error) {
            throw error;
        }
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
    __metadata("design:paramtypes", [knex_service_1.KnexService,
        promo_service_1.PromoService])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map