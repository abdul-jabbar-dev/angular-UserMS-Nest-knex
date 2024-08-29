import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { PromoService } from "./promo.service";
import { PromoController } from "./promo.controller";
import { AuthorizationMiddleware } from "src/middlewares/authorization.middleware";
import { JwtAuthService } from "src/service/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { KnexService } from "src/service/knex.service";

@Module({
  controllers: [PromoController],
  providers: [PromoService, JwtAuthService, JwtService, KnexService],
})
export class PromoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: "promo/create", method: RequestMethod.POST },
        { path: "promo", method: RequestMethod.GET },
        { path: "promo/status/:id", method: RequestMethod.PUT }
      );
  }
}
