import { ProductsService } from "./products.service";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(item: any): Promise<any[]>;
    allProducts({ token, searchQuery }: {
        token: string;
        searchQuery: string;
    } | undefined): Promise<any[]>;
    allProductsAdmin({ pageSize, page, admin, }: {
        pageSize: string | number;
        page: string | number;
        admin: boolean;
    }): Promise<{
        data: any[] | import("../types/Product").TProductResponse[];
        total: any;
        page: number;
        pageSize: number;
    }>;
    singleProduct(id: any): Promise<any>;
    deleteProduct(id: any): Promise<number>;
    myProducts({ user_id }: {
        user_id: any;
    }, query: any): Promise<{
        data: any[];
        group: any;
    }>;
    myProductUpdate(productInfo: any, id: any): Promise<any>;
}
