import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RabbitMQService } from '@shared/rabbitmq';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RabbitMQService],
})
export class PaymentModule {}
