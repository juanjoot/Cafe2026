// src/product/dto/query-product.dto.ts
import {
    IsOptional,
    IsUUID,
    IsBooleanString,
    IsNumberString,
    IsString,
    Min,
  } from 'class-validator';
  
  export class QueryProductDto {
    @IsOptional()
    @IsUUID()
    categoria?: string;
  
    @IsOptional()
    @IsBooleanString()
    destacado?: string;
  
    @IsOptional()
    @IsBooleanString()
    activo?: string;
  
    @IsOptional()
    @IsNumberString()
    @Min(0)
    precioMin?: string;
  
    @IsOptional()
    @IsNumberString()
    @Min(0)
    precioMax?: string;
  
    @IsOptional()
    @IsNumberString()
    @Min(1)
    page?: string;
  
    @IsOptional()
    @IsNumberString()
    @Min(1)
    limit?: string;
  
    @IsOptional()
    @IsString()
    q?: string; // búsqueda por nombre, descripción, etc.
  }
  