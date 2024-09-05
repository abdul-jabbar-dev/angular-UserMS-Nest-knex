import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ShippingService } from "./shipping.service";
import { AuthorizationMiddleware } from "src/middlewares/authorization.middleware";
import { KnexService } from "src/service/knex.service";
import { JwtAuthService } from "src/service/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { PromoService } from "src/promo/promo.service";
import { ShippingController } from "./shipping.controller";

@Module({
  controllers: [ShippingController],
  providers: [
    ShippingService,
    KnexService,
    JwtAuthService,
    JwtService,
    PromoService,
  ],
})
export class ShippingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: "shipping", method: RequestMethod.POST },
        { path: "shipping", method: RequestMethod.GET },
        { path: "shipping/get_rider_order", method: RequestMethod.GET },
        { path: "shipping/add_rider", method: RequestMethod.POST },
        { path: "shipping/confirm_rider/:order_id", method: RequestMethod.PUT },
        { path: "shipping/confirm", method: RequestMethod.POST },
        { path: "shipping/all", method: RequestMethod.GET }
      );
  }
}
