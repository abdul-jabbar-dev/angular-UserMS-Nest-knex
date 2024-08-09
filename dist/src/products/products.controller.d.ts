import { TProduct } from "./../types/Product";
import { ProductsService } from "./products.service";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(item: TProduct): Promise<any[]>;
    allProducts(): Promise<any[]>;
    singleProduct(id: any): Promise<any>;
    deleteProduct(id: any): Promise<number>;
    myProducts({ user_id }: {
        user_id: any;
    }): Promise<any[] | any[]>;
}
