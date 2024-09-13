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
          req.route.path === "/user/get_user/:id" ||
          req.route.path === "/shipping/get_rider_order" ||
          req.route.path === "/shipping/:product_id" ||
          req.route.path === "/shipping/confirm_delivery/:orderId" ||
          req.route.path === "/shipping/confirm_rider/:order_id" ||
          req.route.path === "/user/rider/get_history" ||
          req.route.path === "/user/delete" ||
          req.route.path === "/user/update_password" ||
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
      if (error.response.message === "Login Required!") {
        throw new UnauthorizedException("Login Required!");
      }
      throw new UnauthorizedException(error);
    }
  }
}
