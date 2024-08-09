import { KnexService } from "src/service/knex.service";
import { TProduct } from "src/types/Product";
export declare class ProductsService {
    knex: KnexService;
    constructor(knex: KnexService);
    createNewProduct(item: TProduct): Promise<any[]>;
    getAllProducts(): Promise<any[]>;
    getAProduct(id: string): Promise<any>;
    getMyProducts(id: string): Promise<any[] | any[]>;
    deleteAProduct(id: string): Promise<number>;
}
