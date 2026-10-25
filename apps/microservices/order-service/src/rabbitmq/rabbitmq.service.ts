import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConsumeMessage } from 'amqplib';

/**
 * Servicio de integración con RabbitMQ para order-service.
 * Maneja publicación y consumo de eventos con prefijo 'order.*'.
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
    this.channel.bindQueue(q.queue, 'notifications', 'order.*');

    this.channel.consume(q.queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await this.handler(msg.fields.routingKey, content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('❌ Error procesando mensaje:', error);
          this.channel.nack(msg);
        }
      }
    });
  }

  setHandler(fn: (routingKey: string, data: any) => Promise<void>) {
    this.handler = fn;
  }

  async publish(routingKey: string, message: any) {
    this.channel.publish('notifications', routingKey, Buffer.from(JSON.stringify(message)));
  }
}
