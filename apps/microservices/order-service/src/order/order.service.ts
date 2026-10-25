import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@shared/dto';
import { RabbitMQService } from '@shared/rabbitmq';

@Injectable()
export class OrderService {
  constructor(private rabbitMQService: RabbitMQService) {}

  async createOrder(dto: CreateOrderDto) {
    const order = {
      id: Date.now().toString(),
      items: dto.items,
      total: dto.total,
      createdAt: new Date().toISOString(),
    };

    await this.rabbitMQService.publish('orders', {
      event: 'order_created',
      data: order,
    });

    return order;
  }
}
