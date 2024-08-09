import { JwtAuthService } from "src/service/jwt.service";
import { AuthUtilsService } from "./../service/auth.utils.service";
import { TUser, TUserResponse, Tlogin } from "./../types/User";
import { KnexService } from "src/service/knex.service";
export declare class AuthService {
    private readonly knexService;
    utils: AuthUtilsService;
    jwt: JwtAuthService;
    constructor(knexService: KnexService, utils: AuthUtilsService, jwt: JwtAuthService);
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
    getUserById(id: number): Promise<TUserResponse | null>;
    getUserByEmail(email: string): Promise<TUserResponse | null>;
    loginUser(userInfo: Tlogin): Promise<{
        data: TUserResponse;
        token: string;
    }>;
    registerUser(userInfo: TUser): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    userStatusUpdate(id: string): Promise<number>;
    userUpdateRole(id: string): Promise<number>;
    UserDeleteRoute(id: string): Promise<number>;
    UserProfile(id: string): Promise<any>;
    UserUpdateProfile({ email, password, user_id, username, ...userInfo }: Partial<TUser & {
        user_id: any;
        username: string;
    }>): Promise<number>;
}
