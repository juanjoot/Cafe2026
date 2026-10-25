// src/category/dto/create-category.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
  
  @IsArray()
  @IsUUID('all', { each: true })
  @Type(() => String)
  subcategorias?: string[];
}
