import { JwtAuthService } from "src/service/jwt.service";
import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class AuthorizationMiddleware implements NestMiddleware {
    protected jwt: JwtAuthService;
    constructor(jwt: JwtAuthService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
