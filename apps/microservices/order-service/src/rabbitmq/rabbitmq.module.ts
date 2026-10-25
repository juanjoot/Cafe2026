import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

/**
 * Módulo de mensajería para RabbitMQ dentro de order-service.
 */
@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
