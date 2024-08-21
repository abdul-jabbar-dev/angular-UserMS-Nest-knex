import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ShippingService } from "./shipping.service";
import { ShippingController } from "./shipping.controller";
import { AuthorizationMiddleware } from "src/middlewares/authorization.middleware";
import { KnexService } from "src/service/knex.service";
import { JwtAuthService } from "src/service/jwt.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, KnexService, JwtAuthService, JwtService],
})
export class ShippingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: "shipping", method: RequestMethod.POST });
  }
}
