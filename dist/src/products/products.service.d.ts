import { JwtService } from '@nestjs/jwt';
import { KnexService } from 'src/service/knex.service';
import { TProduct } from 'src/types/Product';
export declare class ProductsService {
    knex: KnexService;
    jwt: JwtService;
    constructor(knex: KnexService, jwt: JwtService);
    createNewProduct(item: TProduct & {
        user_id: any;
    }): Promise<any[]>;
    getAllProducts(token: string | undefined): Promise<any[]>;
    getAProduct(id: string): Promise<any>;
    getMyProducts(id: string): Promise<any[] | any[]>;
    deleteAProduct(id: string): Promise<number>;
    updateMyProduct(updatedData: Partial<TProduct>, id: string): Promise<any>;
}
