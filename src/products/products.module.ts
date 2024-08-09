import { JwtService } from "@nestjs/jwt";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { KnexService } from "src/service/knex.service";
import { AuthorizationMiddleware } from "src/middlewares/authorization.middleware";
import { JwtAuthService } from "src/service/jwt.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, KnexService, JwtAuthService, JwtService],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: "product/create", method: RequestMethod.POST },
        { path: "product/my_products", method: RequestMethod.GET }
      );
  }
}
