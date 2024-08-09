import { NestFactory } from '@nestjs/core'; 
import { AppModule } from './app.module';
import * as cookie from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookie())
 app.enableCors({
   origin: "*",
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
   allowedHeaders: "Content-Type, Accept, Authorization",
 });
  await app.listen(3000);
}
bootstrap();
