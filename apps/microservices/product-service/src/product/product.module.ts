import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { SubCategory } from '../subcategory/entities/subcategory.entity';
import { ProductController } from './product.controller'; 
import { ProductService } from './product.service';       

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
