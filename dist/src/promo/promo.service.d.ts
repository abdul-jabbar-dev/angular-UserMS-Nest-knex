import { KnexService } from "./../service/knex.service";
import { TPromocode, TPromocodeResponce } from "./../types/Promo";
export declare class PromoService {
    protected knex: KnexService;
    constructor(knex: KnexService);
    create(user_id: string, createPromo: TPromocode): Promise<any>;
    findAll(pageSize: string | Number | undefined, page: string | undefined | Number): Promise<{
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
    for_users(): Promise<TPromocodeResponce[]>;
    verifyCode(code: string): Promise<any>;
    findOne(id: number): Promise<TPromocodeResponce>;
    update(id: number, updatePromoDto: TPromocode): Promise<any>;
    toggleState(id: number): Promise<any[]>;
    toggleVisibility(id: number): Promise<any[]>;
    usePromocode(id: number): Promise<TPromocodeResponce>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
