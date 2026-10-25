import { Module, Controller, Get } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';


@Controller('public')
@SkipThrottle()
export class PublicController {
  @Get()
  getPublicData() {
    return 'Este endpoint no está limitado.';
  }
}

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // Tiempo de vida en milisegundos (60 segundos)
          limit: 10,  // Máximo de 10 solicitudes por TTL
        },
      ],
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [AppController, PublicController], // ✅ aquí se agrega
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
