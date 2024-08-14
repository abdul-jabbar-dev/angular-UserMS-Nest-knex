import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(item: any): Promise<any[]>;
    allProducts(user: any, { token }: {
        token: string;
    } | undefined): Promise<any[]>;
    singleProduct(id: any): Promise<any>;
    deleteProduct(id: any): Promise<number>;
    myProducts({ user_id }: {
        user_id: any;
    }): Promise<any[] | any[]>;
    myProductUpdate(productInfo: any, id: any): Promise<any>;
}
