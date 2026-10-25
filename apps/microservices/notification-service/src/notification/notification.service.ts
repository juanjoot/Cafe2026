import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '@shared/dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRecord } from './notification.entity';

/**
 * Servicio que maneja las notificaciones del sistema.
 * Escucha eventos de RabbitMQ y envía correos electrónicos
 * en respuesta a eventos como creación de pedidos y pagos exitosos.
 */
@Injectable()
export class NotificationService implements OnModuleInit {
  // Configura el transporte de correo usando variables de entorno
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  constructor(
    private readonly rabbit: RabbitMQService,
    @InjectRepository(NotificationRecord)
    private readonly notificationRepository: Repository<NotificationRecord>,
  ) {}

  /**
   * Se ejecuta al iniciar el módulo.
   * Asigna el manejador de eventos para RabbitMQ.
   */
  async onModuleInit() {
    this.rabbit.setHandler(async (event: string, data: any) => {
      await this.handleEvent(event, data);
    });
  }

  /**
   * Envía un correo electrónico utilizando el transportador configurado.
   * @param dto Objeto con la información del correo a enviar.
   */
  async sendEmail(
    dto: SendEmailDto,
    metadata: { orderId?: string; paymentId?: string; eventType?: string } = {},
  ) {
    const notification = await this.notificationRepository.save(
      this.notificationRepository.create({
        orderId: metadata.orderId ?? null,
        paymentId: metadata.paymentId ?? null,
        eventType: metadata.eventType ?? null,
        recipient: dto.to,
        subject: dto.subject,
        body: dto.text ?? dto.html ?? dto.body ?? '',
        status: 'pending',
        providerMessageId: null,
        errorMessage: null,
        sentAt: null,
      }),
    );

    try {
      const info = await this.transporter.sendMail({
        from: '"Café de la Finca" <no-reply@cafefinca.com>',
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
        attachments: dto.attachments,
      });

      notification.status = 'sent';
      notification.providerMessageId = info.messageId;
      notification.sentAt = new Date();
      await this.notificationRepository.save(notification);

      console.log(`📤 Email enviado a ${dto.to}, ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      notification.status = 'failed';
      notification.errorMessage = error instanceof Error ? error.message : String(error);
      await this.notificationRepository.save(notification);
      throw error;
    }
  }

  /**
   * Maneja eventos recibidos desde RabbitMQ.
   * Ejecuta la lógica correspondiente según el tipo de evento.
   */
  async handleEvent(event: string, data: any) {
    if (event === 'order.created') {
      // Notificación de nueva orden
      await this.sendEmail({
        to: data.customerEmail,
        subject: '¡Tu pedido ha sido recibido!',
        html: `<h2>Gracias por tu compra</h2><p>Pedido #${data.id}</p>`,
      }, { orderId: data.id, eventType: event });
    } else if (event === 'payment.successful') {
      // Notificación de pago exitoso
      await this.sendEmail({
        to: data.customerEmail ?? data.email,
        subject: '✅ Pago recibido',
        html: `<p>Tu pago por la orden #${data.orderId} fue exitoso.</p>`,
      }, {
        orderId: data.orderId,
        paymentId: data.paymentId,
        eventType: event,
      });
    } else {
      // Otros eventos no manejados
      console.warn(`⚠️ Evento no manejado: ${event}`);
    }
  }
}


