import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Client, ClientSchema } from './schemas/client.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RabbitMQModule } from '@shared/rabbitmq'; // ✅ importa aquí

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },      
    ]),
    RabbitMQModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
