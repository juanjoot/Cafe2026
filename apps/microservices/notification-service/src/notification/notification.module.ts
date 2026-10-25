import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NotificationRecord,
  OrderReference,
  PaymentReference,
} from './notification.entity';

/**
 * Módulo encargado de las notificaciones del sistema.
 * Importa el módulo de RabbitMQ para poder consumir eventos asincrónicos.
 */
@Module({
  imports: [
    RabbitMQModule,
    TypeOrmModule.forFeature([NotificationRecord, OrderReference, PaymentReference]),
  ],
  providers: [NotificationService],   // Registra el servicio de notificaciones como proveedor
})
export class NotificationModule {}
