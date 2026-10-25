import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendEmailDto } from '@shared/dto';

/**
 * Controlador HTTP para gestionar notificaciones del sistema.
 * Expuesto en la ruta base /notify.
 */
@Controller('notify')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Endpoint POST /notify/email
   * Permite enviar correos electrónicos a través del servicio de notificaciones.
   * @param dto Contiene los datos necesarios para enviar el correo (destinatario, asunto, cuerpo, etc).
   */
  @Post('email')
  async sendEmail(@Body() dto: SendEmailDto) {
    return this.notificationService.sendEmail(dto);
  }
}
