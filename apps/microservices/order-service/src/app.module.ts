import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { ProductReference } from './order/product-reference.entity';
import { RabbitMQModule } from '@shared/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Order, OrderItem, ProductReference],
      synchronize: false,
    }),
    OrderModule,
    RabbitMQModule,
  ],
})
export class AppModule {}

