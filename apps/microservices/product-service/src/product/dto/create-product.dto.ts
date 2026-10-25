// src/product/dto/create-product.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsArray,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  descripcion!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock!: number;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsString()
  imagen1?: string;

  @IsOptional()
  @IsString()
  imagen2?: string;

  @IsOptional()
  @IsString()
  imagen3?: string;

  @IsOptional()
  @IsString()
  imagen4?: string;

  @IsNotEmpty()
  @IsString()
  sku!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  @Type(() => String) // ✅ para relaciones con id tipo uuid en PostgreSQL
  categoria!: string;

  @IsOptional()
  @IsUUID()
  subcategoria?: string;
}
