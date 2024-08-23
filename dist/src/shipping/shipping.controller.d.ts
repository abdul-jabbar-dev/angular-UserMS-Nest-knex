import { ShippingService } from "./shipping.service";
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    create(createShipping: any): Promise<{
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
    }>;
    findAll(): string;
    findOne(id: string, userInfo: any): Promise<any>;
    update(id: string, updateShipping: any): string;
    remove(id: string): string;
}
