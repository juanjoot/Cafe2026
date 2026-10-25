import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { RabbitMQModule } from '@shared/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule,                      // ✅ INCLUIR AQUÍ
    NotificationModule,
  ],
})
export class AppModule {}
