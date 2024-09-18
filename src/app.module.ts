import { FileSystemService } from './service/file-system.service';
import { MyGateway } from './Getway';
import { MailModule } from './modules/Mail.module';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './service/mail.service';
import { NotFoundExceptionFilter } from "./NotFound";

import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { KnexService } from "./service/knex.service";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthUtilsService } from "./service/auth.utils.service";
import { JwtAuthService } from "./service/jwt.service";
import { ProductsModule } from "./products/products.module";
import { APP_FILTER } from "@nestjs/core";
import { ShippingModule } from "./shipping/shipping.module";
import { PromoModule } from "./promo/promo.module";


@Module({
  imports: [AuthModule, ProductsModule, ShippingModule, PromoModule,MailModule],
  controllers: [AppController, AuthController],
  providers: [
    // MyGateway,
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    AppService,
    KnexService,
    AuthService,
    // FileSystemService,
    AuthUtilsService,
    JwtAuthService,
    JwtService
  ],
})
export class AppModule {}
