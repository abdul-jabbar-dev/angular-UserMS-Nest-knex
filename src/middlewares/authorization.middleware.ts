import { JwtAuthService } from "src/service/jwt.service";
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(protected jwt: JwtAuthService) {}
  async use(req: Request, res: Response, next: NextFunction) { 
    try {
      if (req.headers.authorization) {
        let token = req.headers.authorization;
        if (token.includes("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
        }
        const user = await this.jwt.decryptToken(token);
        
        if (
          (user as any)?.role === "admin" ||
          req.route.path === "/product/create" ||
          req.route.path === "/shipping" ||
          req.route.path === "/user/get_my_profile" ||
          req.route.path === "/shipping/:product_id" ||
          req.route.path === "/shipping/confirm" ||
          req.route.path === "/product/my_products" ||
          req.route.path === "/user/update_profile"
        ) {
          req.body.user_id = (user as any).id;
          next();
        } else {
          throw new UnauthorizedException("Unauthorized! Admin can handle.");
        }
      } else {
        throw new UnauthorizedException("Login Required!");
      }
    } catch (error) {
      throw new UnauthorizedException("error");
    }
  }
}
