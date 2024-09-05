import { KnexService } from "src/service/knex.service";
export declare class OrderService {
    protected knex: KnexService;
    constructor(knex: KnexService);
    create(createOrderDto: any): Promise<void>;
    findAll(): Promise<string>;
    findOne(id: number): Promise<string>;
    update(id: number, updateOrderDto: any): Promise<string>;
    remove(id: number): Promise<string>;
}
