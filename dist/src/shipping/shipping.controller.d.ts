import { ShippingService } from "./shipping.service";
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    findAll({ user_id }: {
        user_id: any;
    }): Promise<{
        data: any[];
    }>;
    create(createShipping: any): Promise<any>;
    confirmPayment(createShipping: any): Promise<string>;
    findOne(id: string): Promise<any>;
    update(id: string, updateShipping: any): string;
    addPromo(id: string, updateShipping: any): Promise<any>;
    remove(id: string): string;
}
