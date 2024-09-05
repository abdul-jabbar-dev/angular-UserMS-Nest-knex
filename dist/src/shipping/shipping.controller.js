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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingController = void 0;
const common_1 = require("@nestjs/common");
const shipping_service_1 = require("./shipping.service");
let ShippingController = class ShippingController {
    constructor(shippingService) {
        this.shippingService = shippingService;
    }
    findAll({ user_id }) {
        return this.shippingService.findAll(user_id);
    }
    findAllOrderRider({ user_id }) {
        return this.shippingService.findAllOrderRider(user_id);
    }
    findAllOrderAdmin() {
        return this.shippingService.findAllOrderAdmin();
    }
    findAOrderRider(id, { user_id }) {
        return this.shippingService.findAOrderRider(user_id, id);
    }
    async rider_confirm(id, { user_id }) {
        const res = await this.shippingService.findAOrderRider(user_id, id);
        return await this.shippingService.rider_confirm(res);
    }
    async create(createShipping) {
        const result = await this.shippingService.create(createShipping);
        return result;
    }
    async addRider(createShipping) {
        const result = await this.shippingService.addrider(createShipping);
        return result;
    }
    async confirmPayment(createShipping) {
        return await this.shippingService.confirmPayment(createShipping);
    }
    async findOne(id) {
        return await this.shippingService.findOne(+id);
    }
    update(id, updateShipping) {
        return this.shippingService.update(+id, updateShipping);
    }
    addPromo(id, updateShipping) {
        return this.shippingService.addPromo(+id, updateShipping);
    }
    remove(id) {
        return this.shippingService.remove(+id);
    }
};
exports.ShippingController = ShippingController;
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/get_rider_order"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "findAllOrderRider", null);
__decorate([
    (0, common_1.Get)("/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "findAllOrderAdmin", null);
__decorate([
    __param(0, (0, common_1.Param)("order_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "findAOrderRider", null);
__decorate([
    (0, common_1.Put)("/confirm_rider/:order_id"),
    __param(0, (0, common_1.Param)("order_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "rider_confirm", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("/add_rider"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "addRider", null);
__decorate([
    (0, common_1.Post)("/confirm"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Get)(":product_id"),
    __param(0, (0, common_1.Param)("product_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("addpromo/:orderId"),
    __param(0, (0, common_1.Param)("orderId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "addPromo", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "remove", null);
exports.ShippingController = ShippingController = __decorate([
    (0, common_1.Controller)("shipping"),
    __metadata("design:paramtypes", [shipping_service_1.ShippingService])
], ShippingController);
//# sourceMappingURL=shipping.controller.js.map