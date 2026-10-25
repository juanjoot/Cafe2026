import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RabbitMQService } from '@shared/rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderReference, Payment } from './payment.entity';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RabbitMQService],
  imports: [TypeOrmModule.forFeature([Payment, OrderReference])],
})
export class PaymentModule {}
