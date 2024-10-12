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
  app.use(auth(auth0Config)); //cambio
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle("ecommercejam")
    .setDescription(
      "Bienvenido a la API de Ecommerce JAM, una plataforma de ecommerce modular y escalable construida con NestJS.\n\n" +
      "La aplicación está organizada en módulos funcionales como users, categories, products, orders, auth, y cloudinary, lo que permite mantener un código limpio y reutilizable.\n\n" +
      "La aplicación está desplegada en Render y utiliza Docker para la gestión y despliegue de contenedores, asegurando un entorno estable y replicable en producción.\n\n" +
      "Los módulos comparten métodos y repositorios, facilitando la reutilización del código y evitando duplicaciones. Además, cuenta con interceptores, assets, utils, helpers, decorators, y middlewares que optimizan el rendimiento y la seguridad.\n\n" +
      "La carpeta test contiene pruebas de integración que garantizan la estabilidad de la plataforma. La API permite gestionar usuarios, productos, órdenes, categorías, autenticación, e integrar Cloudinary para el manejo de imágenes."
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
    
    // app.useGlobalInterceptors(new TokenInfoInterceptor());
    await app.listen(process.env.PORT);
}
bootstrap();
