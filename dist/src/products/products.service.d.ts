import { JwtService } from "@nestjs/jwt";
import { KnexService } from "src/service/knex.service";
import { TProduct, TProductResponse } from "src/types/Product";
export declare class ProductsService {
    knex: KnexService;
    jwt: JwtService;
    constructor(knex: KnexService, jwt: JwtService);
    createNewProduct(item: TProduct & {
        user_id: any;
    }): Promise<any[]>;
    getAllProducts(token: string | undefined, searchQuery: string | undefined): Promise<any[]>;
    getAllProductsAdmin(pageSize: string | Number | undefined, page: string | undefined | Number): Promise<{
        data: any[] | TProductResponse[];
        total: any;
        page: number;
        pageSize: number;
    }>;
    getAProduct(id: string): Promise<any>;
    getMyProducts(userId: string, query: any): Promise<{
        data: any[];
        group: any;
    }>;
    deleteAProduct(id: string): Promise<number>;
    updateMyProduct(updatedData: Partial<TProduct>, id: string): Promise<any>;
}
