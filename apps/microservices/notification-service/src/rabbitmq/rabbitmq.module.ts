import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

/**
 * Módulo que encapsula el consumo de eventos RabbitMQ.
 */
@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
