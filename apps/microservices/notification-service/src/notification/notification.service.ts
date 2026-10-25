import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '@shared/dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

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

  constructor(private readonly rabbit: RabbitMQService) {}

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
  async sendEmail(dto: SendEmailDto) {
    const info = await this.transporter.sendMail({
      from: '"Café de la Finca" <no-reply@cafefinca.com>',
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      html: dto.html,
      attachments: dto.attachments,
    });

    console.log(`📤 Email enviado a ${dto.to}, ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
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
      });
    } else if (event === 'payment.successful') {
      // Notificación de pago exitoso
      await this.sendEmail({
        to: data.customerEmail,
        subject: '✅ Pago recibido',
        html: `<p>Tu pago por la orden #${data.orderId} fue exitoso.</p>`,
      });
    } else {
      // Otros eventos no manejados
      console.warn(`⚠️ Evento no manejado: ${event}`);
    }
  }
}



