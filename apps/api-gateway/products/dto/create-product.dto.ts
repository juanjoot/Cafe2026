import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsNumber()
  @IsNotEmpty()
  precio!: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  @IsBoolean()
  @IsOptional()
  destacado?: boolean;
}
