import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Client, ClientSchema } from '../user/schemas/client.schema';
import { JwtModule } from '@nestjs/jwt';
import { RabbitMQModule } from '@shared/rabbitmq';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    RabbitMQModule,
    MongooseModule.forFeature([ { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret_dev_token',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
