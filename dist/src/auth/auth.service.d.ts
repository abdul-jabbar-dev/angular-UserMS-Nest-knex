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
    gen_new_pass(id: string, { password }: {
        password: any;
    }): Promise<number>;
    send_code_for_reset(email: string): Promise<TUserResponse[]>;
    registerUser(userInfo: TUser): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    userStatusUpdate(id: string): Promise<number>;
    userUpdateRole(id: string): Promise<number>;
    UserDeleteRoute(id: string): Promise<number>;
    UserProfile(id: string): Promise<any>;
    UserUpdateProfile({ new_password, age, first_name, last_name, user_id, phone, }: Partial<TUser & {
        user_id: any;
        username: string;
        new_password?: string;
    }>): Promise<number>;
}
