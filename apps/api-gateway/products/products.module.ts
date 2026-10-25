import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule,AuthModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
