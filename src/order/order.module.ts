import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthorizationMiddleware } from 'src/middlewares/authorization.middleware';
import { JwtAuthService } from 'src/service/jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { KnexService } from 'src/service/knex.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, KnexService, JwtAuthService, JwtService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: "order", method: RequestMethod.POST });
  }
}

