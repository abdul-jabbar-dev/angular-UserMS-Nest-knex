import { TUserResponse } from "./User";
export interface TProduct {
    id?: string;
    title: string;
    desc: string;
    price: number;
    image: string;
    user_id: number | string | TUserResponse;
}
export interface TProductResponse {
    id: string;
    title: string;
    user_id: number | string | TUserResponse;
    desc?: string;
    created_at: Date;
    status: "available" | "sold" | "hide";
    price: number;
}
