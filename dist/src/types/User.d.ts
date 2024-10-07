export interface TUserResponse {
    id: number;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    reset_code?: string;
    phone: string;
    status: "active" | "deactive";
    role: "admin" | "subscriber" | "rider";
    created_at: Date;
    updated_at: Date;
}
export interface TUser {
    id?: number;
    password?: string;
    role?: "admin" | "subscriber" | "rider";
    first_name: string;
    email: string;
    username?: string;
    reset_code?: string;
    last_name: string;
    age: number;
    phone: string;
}
export interface Tlogin {
    password: string;
    email: string;
}
