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
    getRider(): Promise<TUserResponse[] | null>;
    getRiderHistory({ user_id }: {
        user_id: any;
    }): Promise<{
        totalDone: number;
        totalBenifit: number;
        totalPending: number;
    }>;
    registerUser(user: TUser): Promise<{
        data: TUserResponse;
        token: string;
    } | null>;
    loginUser(user: Tlogin): Promise<{
        data: TUserResponse;
        token: string;
    }>;
    sendCodeForReset({ email }: {
        email: any;
    }): Promise<TUserResponse[]>;
    genNewPass(id: string, password: any): Promise<number>;
    updateStatus(id: string): Promise<number>;
    updatePassword({ oldPassword, newPassword, user_id, }: {
        oldPassword: string;
        newPassword: string;
        user_id: string | number;
    }): Promise<Pick<TUserResponse, "id">[]>;
    updateRole(id: string): Promise<number>;
    deleteUser({ user_id }: {
        user_id: any;
    }): Promise<number>;
    deleteUserByAdmin(id: string): Promise<number>;
    updateProfile(user: Partial<TUser & {
        user_id: string;
    }>): Promise<number>;
}
