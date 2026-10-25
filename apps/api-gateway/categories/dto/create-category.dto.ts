import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
