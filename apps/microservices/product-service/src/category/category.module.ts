// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SubCategory } from '../subcategory/entities/subcategory.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Category,SubCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
