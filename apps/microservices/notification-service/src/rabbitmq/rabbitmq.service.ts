import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConsumeMessage } from 'amqplib';

/**
 * Servicio para consumir mensajes de RabbitMQ dentro de notification-service.
 * Usa patrón Topic para recibir eventos de otros microservicios.
 */
@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel!: amqp.Channel;
  private handler: (routingKey: string, data: any) => Promise<void> = async () => {};

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    this.channel = await connection.createChannel();

    await this.channel.assertExchange('notifications', 'topic', { durable: true });

    const q = await this.channel.assertQueue('', { exclusive: true });

    // 🔔 Escuchar eventos relacionados con orden y pago
    this.channel.bindQueue(q.queue, 'notifications', 'order.*');
    this.channel.bindQueue(q.queue, 'notifications', 'payment.*');

    this.channel.consume(q.queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await this.handler(msg.fields.routingKey, content);
          this.channel.ack(msg);
        } catch (err) {
          console.error('❌ Error al procesar mensaje RabbitMQ:', err);
          this.channel.nack(msg);
        }
      }
    });
  }

  /**
   * Establece la función que manejará los mensajes recibidos.
   */
  setHandler(fn: (routingKey: string, data: any) => Promise<void>) {
    this.handler = fn;
  }
}
