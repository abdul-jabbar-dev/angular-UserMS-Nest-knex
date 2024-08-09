import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookie from "cookie-parser";
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookie());
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          "https://secondhand-item.netlify.app",
          "https://secondhand-item.netlify.app/login",
          "https://secondhand-item.netlify.app/create",
          "https://secondhand-item.netlify.app/*",
          "http://localhost:4200",
          origin,
          "*",
        ];
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: "Content-Type, Accept, Authorization",
    })
  );

  await app.listen(3000);
}
bootstrap();
