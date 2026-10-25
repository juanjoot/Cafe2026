// src/subcategory/subcategory.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { SubCategoryService } from './subcategory.service';
import { SubCategoryController } from './subcategory.controller';
import { Category } from '../category/entities/category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([SubCategory,Category])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
