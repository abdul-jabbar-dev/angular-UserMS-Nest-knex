import { KnexService } from "src/service/knex.service";
import { TOrder } from "./../types/Shipping";
export declare class ShippingService {
    private readonly knexService;
    constructor(knexService: KnexService);
    create(createShipping: TOrder): Promise<number>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateShippingDto: any): string;
    remove(id: number): string;
}
