import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from '@shared/dto';
import { RabbitMQService } from '@shared/rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReference, Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private rabbitMQService: RabbitMQService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(OrderReference)
    private readonly orderRepository: Repository<OrderReference>,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY')!;
    this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  }

  async createCharge(dto: CreatePaymentDto) {
    if (!dto.orderId || !Number.isInteger(dto.amount) || dto.amount <= 0) {
      throw new BadRequestException('Se requiere una orden y un monto válido en centavos');
    }

    if ((dto.currency ?? 'usd').toLowerCase() !== 'usd') {
      throw new BadRequestException('Las órdenes del catálogo se cobran en USD');
    }

    const order = await this.orderRepository.findOneBy({ id: dto.orderId });
    if (!order) {
      throw new NotFoundException(`No existe la orden ${dto.orderId}`);
    }

    if (dto.amount !== Math.round(Number(order.total) * 100)) {
      throw new BadRequestException('El monto del pago debe coincidir con el total de la orden');
    }

    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        orderId: dto.orderId,
        amount: dto.amount,
        currency: (dto.currency ?? 'usd').toLowerCase(),
        email: dto.email ?? order.customerEmail,
        status: 'pending',
        stripeChargeId: null,
      }),
    );

    let charge: Stripe.Response<Stripe.Charge>;
    try {
      charge = await this.stripe.charges.create({
        amount: dto.amount,
        currency: payment.currency,
        source: dto.source,
        description: `Pago para orden ${dto.orderId}`,
      });
    } catch (error) {
      payment.status = 'failed';
      await this.paymentRepository.save(payment);
      throw error;
    }

    payment.stripeChargeId = charge.id;
    payment.status = charge.status;
    await this.paymentRepository.save(payment);

    if (charge.status === 'succeeded') {
      const customerEmail = dto.email ?? order.customerEmail;
      await this.rabbitMQService.publish('payment.successful', {
        orderId: dto.orderId,
        paymentId: payment.id,
        chargeId: charge.id,
        email: customerEmail,
        customerEmail,
      });
    }

    return charge;
  }
}
