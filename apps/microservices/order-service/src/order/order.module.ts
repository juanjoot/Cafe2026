import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RabbitMQService } from '@shared/rabbitmq';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { ProductReference } from './product-reference.entity';


@Module({
  controllers: [OrderController],
  providers: [OrderService, RabbitMQService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, ProductReference])],
})
export class OrderModule {}
