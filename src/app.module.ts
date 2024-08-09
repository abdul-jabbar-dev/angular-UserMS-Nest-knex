import { AuthorizationMiddleware } from './middlewares/authorization.middleware';

import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { KnexService } from "./service/knex.service";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthUtilsService } from './service/auth.utils.service';
import { JwtAuthService } from './service/jwt.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    KnexService,
    AuthService,
    AuthUtilsService,
    JwtAuthService,
    JwtService,
  ],
})
export class AppModule {
 
}
