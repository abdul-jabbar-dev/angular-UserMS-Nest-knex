import { JwtAuthService } from "src/service/jwt.service";
import { AuthUtilsService } from "./../service/auth.utils.service";
import { TUser, TUserResponse, Tlogin } from "./../types/User";
import { KnexService } from "src/service/knex.service";
import { MailService } from "src/service/mail.service";
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
    loginUser(userInfo: Tlogin): Promise<{
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
