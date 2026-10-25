import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from '@shared/dto';
import { RabbitMQService } from '@shared/rabbitmq';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private rabbitMQService: RabbitMQService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY')!;
    this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  }

  async createCharge(dto: CreatePaymentDto) {
    const charge = await this.stripe.charges.create({
      amount: dto.amount,
      currency: dto.currency,
      source: dto.source,
      description: `Pago para orden ${dto.orderId}`,
    });

    // ✅ Evento estructurado para consumo por notification-service
    await this.rabbitMQService.publish('payment.successful', {
      orderId: dto.orderId,
      chargeId: charge.id,
      email: dto.email, // si lo tienes en DTO
    });

    return charge;
  }
}
