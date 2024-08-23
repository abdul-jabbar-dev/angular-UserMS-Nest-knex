import { KnexService } from "src/service/knex.service";
import { TOrder } from "./../types/Shipping";
type Order = {
    user_id: number;
    product_id: number;
    shipping_email: string;
    shipping_phone: string;
    shipping_zone: string;
    shipping_cost: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    order_status: string;
};
export declare class ShippingService {
    private readonly knexService;
    constructor(knexService: KnexService);
    create(createShipping: TOrder): Promise<Order>;
    findAll(): string;
    findOne(id: number, userInfo: any): Promise<any>;
    update(id: number, updateShippingDto: any): string;
    remove(id: number): string;
}
export {};
