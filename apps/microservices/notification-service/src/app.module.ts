import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { RabbitMQModule } from '@shared/rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NotificationRecord,
  OrderReference,
  PaymentReference,
} from './notification/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [NotificationRecord, OrderReference, PaymentReference],
      synchronize: false,
    }),
    RabbitMQModule,
    NotificationModule,
  ],
})
export class AppModule {}
