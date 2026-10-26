import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@shared/dto';
import { RabbitMQService } from '@shared/rabbitmq';
import { DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductReference } from './product-reference.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto.items?.length || dto.items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
      throw new BadRequestException('La orden debe incluir productos con cantidades válidas');
    }

    const order = await this.dataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(ProductReference);
      const orderRepository = manager.getRepository(Order);
      const itemRepository = manager.getRepository(OrderItem);
      const items: OrderItem[] = [];
      let totalCents = 0;

      for (const [lineNumber, requestedItem] of dto.items.entries()) {
        const product = await productRepository.findOneBy({
          id: requestedItem.productId,
          activo: true,
        });

        if (!product) {
          throw new BadRequestException(`Producto no disponible: ${requestedItem.productId}`);
        }

        const unitPriceCents = Math.round(Number(product.precio) * 100);
        totalCents += unitPriceCents * requestedItem.quantity;
        items.push(
          itemRepository.create({
            lineNumber,
            productId: product.id,
            productName: product.nombre,
            quantity: requestedItem.quantity,
            unitPrice: (unitPriceCents / 100).toFixed(2),
          }),
        );
      }

      const newOrder = orderRepository.create({
        customerId: dto.customerId ?? null,
        customerEmail: dto.customerEmail ?? null,
        total: (totalCents / 100).toFixed(2),
        status: dto.status ?? 'pending',
        items,
      });

      return orderRepository.save(newOrder);
    });

    await this.rabbitMQService.publish('order.created', {
      id: order.id,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items,
    });

    return order;
  }
}
