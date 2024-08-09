import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookie from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookie());
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      "https://secondhand-item.netlify.app"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.enableCors({
    origin: ["https://secondhand-item.netlify.app","*"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
