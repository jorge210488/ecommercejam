import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { TokenInfoInterceptor } from './interceptors/token-info.interceptor';
import { config as auth0Config} from "./config/auth0.config";
import { auth } from 'express-openid-connect';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  app.use(auth(auth0Config));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle("ecommercejam")
    .setDescription("Esta es una API construida con Nest")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
    
    // app.useGlobalInterceptors(new TokenInfoInterceptor());
    await app.listen(process.env.PORT);
}
bootstrap();
