import { PromoService } from "./../promo/promo.service";
import { KnexService } from "src/service/knex.service";
import { TOrder } from "./../types/Shipping";
export declare class ShippingService {
    private readonly knexService;
    protected promoService: PromoService;
    addPromo(id: number, promoId: {
        promocode_id: string;
    }): Promise<any>;
    constructor(knexService: KnexService, promoService: PromoService);
    create(createShipping: TOrder): Promise<any>;
    confirmPayment(createShipping: any): Promise<string>;
    findAll(): string;
    findOne(id: number, userInfo: any): Promise<any>;
    update(id: number, updateShippingDto: any): string;
    remove(id: number): string;
}
