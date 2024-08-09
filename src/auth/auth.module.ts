import { AuthUtilsService } from "./../service/auth.utils.service";
import { JwtAuthService } from "./../service/jwt.service";
import { JwtModule } from "@nestjs/jwt";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { KnexService } from "src/service/knex.service";
import ENV from "src/util/ENV";
import { AuthorizationMiddleware } from "src/middlewares/authorization.middleware";

@Module({
  imports: [
    JwtModule.register({
      secret: ENV.SECRET,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    KnexService,
    JwtAuthService,
    AuthUtilsService,
    JwtAuthService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: "user/status_update/:id", method: RequestMethod.PUT },
        { path: "user/role_update/:id", method: RequestMethod.PUT },
        { path: "user/get_users", method: RequestMethod.GET },
        { path: "user/delete/:id", method: RequestMethod.DELETE },
        { path: "user/update_profile", method: RequestMethod.PUT },
        { path: "user/get_my_profile", method: RequestMethod.GET }
      );
  }
}
