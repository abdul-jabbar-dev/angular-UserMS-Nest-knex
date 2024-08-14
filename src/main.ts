import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
 
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", 
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true, 
  });

  await app.listen(process.env.PORT||3000);
}
bootstrap();
