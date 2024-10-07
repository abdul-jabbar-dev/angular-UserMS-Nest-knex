import { JwtAuthService } from "src/service/jwt.service";
import { AuthUtilsService } from "./../service/auth.utils.service";
import { TUser, TUserResponse } from "./../types/User";
import { KnexService } from "src/service/knex.service";
import { MailService } from "src/service/mail.service";
export interface UserLoginInfo {
    user_id: number;
    userAgent: string | null;
    device_id: string | null;
    latitude: number | null;
    longitude: number | null;
    platform: string | null;
    location: string | null;
}
export interface UserLoginInfoResponse {
    id: number;
    user_id: string | null;
    login_at: Date;
    userAgent: string | null;
    device_id: string | null;
    created_at: Date;
    updated_at: Date;
    latitude: number | null;
    longitude: number | null;
    platform: string | null;
    location: string | null;
}
export declare class AuthService {
    private readonly knexService;
    utils: AuthUtilsService;
    jwt: JwtAuthService;
    sendMail: MailService;
    constructor(knexService: KnexService, utils: AuthUtilsService, jwt: JwtAuthService, sendMail: MailService);
    getUsers({ pageSize, page, role, }: {
        pageSize: string | number;
        page: string | number;
        role?: "admin" | "subscriber";
    }): Promise<{
        data: TUserResponse[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    getRiders(): Promise<any[] | TUserResponse[]>;
    getRiderHistory(user_id: number): Promise<{
        totalDone: number;
        totalBenifit: number;
        totalPending: number;
    }>;
    getUserById(id: number): Promise<TUserResponse | null>;
    getUserByEmail(email: string): Promise<TUserResponse | null>;
    loginUser(userInfo: {
        email: string;
        password: string;
        meta: any;
    }): Promise<{
        data: TUserResponse;
        token: string;
    }>;
    genNewPass(id: string, { password }: {
        password: any;
    }): Promise<number>;
    sendCodeForReset(email: string): Promise<TUserResponse[]>;
    registerUser(userInfo: TUser): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    userStatusUpdate(id: string): Promise<number>;
    userUpdateRole(id: string): Promise<number>;
    userDeleteRoute(id: string): Promise<number>;
    userProfile(id: string): Promise<any>;
    userUpdateProfile({ new_password, age, first_name, last_name, user_id, phone, }: Partial<TUser & {
        user_id: any;
        username: string;
        new_password?: string;
    }>): Promise<number>;
    updatePassword(oldPassword: string, newPassword: string, user_id: string | number): Promise<Pick<TUserResponse, "id">[]>;
    deleteUser(oldPassword: string, newPassword: string, user_id: string | number): Promise<Pick<TUserResponse, "id">[]>;
}
