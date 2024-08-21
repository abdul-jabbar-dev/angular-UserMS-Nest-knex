import { ShippingService } from "./shipping.service";
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    create(createShipping: any): Promise<number>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateShipping: any): string;
    remove(id: string): string;
}
