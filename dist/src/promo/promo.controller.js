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
exports.PromoController = void 0;
const common_1 = require("@nestjs/common");
const promo_service_1 = require("./promo.service");
let PromoController = class PromoController {
    constructor(promoService) {
        this.promoService = promoService;
    }
    async create(createPromoDto) {
        let { user_id, ...promoInfo } = createPromoDto;
        return await this.promoService.create(user_id, promoInfo);
    }
    findAll({ pageSize = 5, page = 1, admin, }) {
        return this.promoService.findAll(pageSize, page);
    }
    for_users() {
        return this.promoService.for_users();
    }
    async verifyCode(code) {
        const result = await this.promoService.verifyCode(code);
        return result;
    }
    findOne(id) {
        return this.promoService.findOne(+id);
    }
    update(id, updatePromoDto) {
        return this.promoService.update(+id, updatePromoDto);
    }
    toggoleState(id) {
        return this.promoService.toggleState(Number(id));
    }
    toggoleVisibility(id) {
        return this.promoService.toggleVisibility(Number(id));
    }
    usePromocode(id) {
        return this.promoService.usePromocode(Number(id));
    }
    remove(id) {
        return this.promoService.remove(+id);
    }
};
exports.PromoController = PromoController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("for_users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "for_users", null);
__decorate([
    (0, common_1.Get)("verify/:code"),
    __param(0, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromoController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("status/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "toggoleState", null);
__decorate([
    (0, common_1.Put)("visibility/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "toggoleVisibility", null);
__decorate([
    (0, common_1.Put)("use/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "usePromocode", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromoController.prototype, "remove", null);
exports.PromoController = PromoController = __decorate([
    (0, common_1.Controller)("promo"),
    __metadata("design:paramtypes", [promo_service_1.PromoService])
], PromoController);
//# sourceMappingURL=promo.controller.js.map