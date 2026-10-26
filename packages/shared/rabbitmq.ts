import { Global, Injectable, Module } from '@nestjs/common';

@Injectable()
export class RabbitMQService {
  async publish(_routingKey: string, _message: unknown): Promise<void> {
    return;
  }

  async consume(_routingKey: string, _handler: (message: unknown) => Promise<void>): Promise<void> {
    return;
  }
}

@Global()
@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
