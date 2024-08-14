import { JwtService } from "@nestjs/jwt";
export declare class JwtAuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateToken(user: {
        username: string;
        id: string;
        email: string;
        role: string;
    }): Promise<string>;
    decryptToken(token: string): Promise<string>;
}
