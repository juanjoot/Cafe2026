import { IsOptional, IsString, IsBoolean, IsNumberString } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @IsOptional()
  @IsNumberString()
  precioMax?: string;

  @IsOptional()
  @IsNumberString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
