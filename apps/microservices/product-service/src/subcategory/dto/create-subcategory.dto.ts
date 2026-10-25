import { IsNotEmpty, IsOptional, IsUUID, IsString,IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsArray()
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  @Type(() => String)
  categoria?: string;
}
