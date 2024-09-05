import { AuthService } from "./auth.service";
import { TUser, TUserResponse, Tlogin } from "src/types/User";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    myprofile({ user_id }: {
        user_id: any;
    }): Promise<any>;
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
    getUser(id: string): Promise<TUserResponse | null>;
    getrider(): Promise<TUserResponse[] | null>;
    registerUser(user: TUser): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    loginUser(user: Tlogin): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    updateStatus(id: string): Promise<number>;
    updateRole(id: string): Promise<number>;
    deleteUser(id: string): Promise<number>;
    updateProfile(user: Partial<TUser & {
        user_id: string;
    }>): Promise<number>;
}
