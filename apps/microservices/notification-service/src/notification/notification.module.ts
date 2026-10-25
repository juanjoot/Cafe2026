import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

/**
 * Módulo encargado de las notificaciones del sistema.
 * Importa el módulo de RabbitMQ para poder consumir eventos asincrónicos.
 */
@Module({
  imports: [RabbitMQModule],          // Importa el módulo que configura la conexión a RabbitMQ
  providers: [NotificationService],   // Registra el servicio de notificaciones como proveedor
})
export class NotificationModule {}

