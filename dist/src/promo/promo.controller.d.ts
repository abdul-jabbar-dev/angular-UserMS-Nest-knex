import { PromoService } from "./promo.service";
export declare class PromoController {
    private readonly promoService;
    constructor(promoService: PromoService);
    create(createPromoDto: any): Promise<any>;
    findAll({ pageSize, page, admin, }: {
        pageSize: string | number;
        page: string | number;
        admin: boolean;
    }): Promise<{
        data: {
            is_expire: boolean;
            id: number;
            code: string;
            discount_amount: number;
            discount_type: "percentage" | "fixed";
            valid_from: Date;
            valid_to: Date;
            usage_limit: number;
            times_used: number;
            is_active: boolean;
            author_id: number;
            created_at: Date;
            visible: "private" | "public";
            updated_at: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    for_users(): Promise<import("../types/Promo").TPromocodeResponce[]>;
    verifyCode(code: any): Promise<any>;
    findOne(id: string): Promise<import("../types/Promo").TPromocodeResponce>;
    update(id: string, updatePromoDto: any): Promise<any>;
    toggoleState(id: string): Promise<any[]>;
    toggoleVisibility(id: string): Promise<any[]>;
    usePromocode(id: string): Promise<import("../types/Promo").TPromocodeResponce>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
