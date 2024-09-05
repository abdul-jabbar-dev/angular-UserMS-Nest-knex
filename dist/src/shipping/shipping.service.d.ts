import { PromoService } from "./../promo/promo.service";
import { KnexService } from "src/service/knex.service";
import { TOrder } from "./../types/Shipping";
export declare class ShippingService {
    private readonly knexService;
    protected promoService: PromoService;
    constructor(knexService: KnexService, promoService: PromoService);
    addPromo(id: number, promoId: {
        promocode_id: string;
    }): Promise<any>;
    create(createShipping: TOrder): Promise<any>;
    addrider(createShipping: any): Promise<any>;
    confirmPayment(createShipping: any): Promise<string>;
    findAll(user_id: string): Promise<{
        data: any[];
    }>;
    findAllOrderAdmin(): Promise<{
        data: any[];
    }>;
    findAllOrderRider(user_id: string): Promise<any[]>;
    findAOrderRider(user_id: string, order_id: string): Promise<any[]>;
    findOne(id: number): Promise<any>;
    rider_confirm(delivery: any): Promise<any>;
    update(id: number, updateShippingDto: any): string;
    remove(id: number): string;
}
