import { ShippingService } from "./shipping.service";
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    create(createShipping: any): Promise<any>;
    confirmPayment(createShipping: any): Promise<string>;
    findAll(): string;
    findOne(id: string, userInfo: any): Promise<any>;
    update(id: string, updateShipping: any): string;
    remove(id: string): string;
}
