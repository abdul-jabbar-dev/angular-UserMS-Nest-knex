import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrder: any): Promise<void>;
    findAll(): Promise<string>;
    findOne(id: string): Promise<string>;
    update(id: string, updateOrderDto: any): Promise<string>;
    remove(id: string): Promise<string>;
}
