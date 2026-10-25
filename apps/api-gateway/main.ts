import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResponseInterceptor } from './response.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
//import * as dotenv from 'dotenv';

async function bootstrap() {
  // Cargar variables de entorno
  //dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Habilitar CORS si el frontend se conecta desde otro origen
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // o http://localhost:4200
    credentials: true,
  });

  // Usar pipes globales de validación
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
 

  const port = process.env.PORT || 3001;

  await app.listen(port);
  Logger.log(`🚀 API Gateway is running on http://localhost:${port}`);
}
bootstrap();
