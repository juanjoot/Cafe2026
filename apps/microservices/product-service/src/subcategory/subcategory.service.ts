// src/subcategory/subcategory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { Category } from '../category/entities/category.entity';


@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateSubCategoryDto) {
    // Validar que la categoría exista
    const categoria = await this.categoryRepo.findOneBy({ id: dto.categoria });

    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    // Crear instancia SubCategory con objeto Category
    const subCategory = this.subCategoryRepo.create({
      ...dto,
      categoria, // ✅ relación correctamente tipada
    });

    return this.subCategoryRepo.save(subCategory);
  }

  findAll() {
    return this.subCategoryRepo.find({ relations: ['categoria'] });
  }

  findOne(id: string) {
    return this.subCategoryRepo.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }
  
  async update(id: string, dto: UpdateSubCategoryDto) {
    const existing = await this.subCategoryRepo.findOne({
      where: { id },
      relations: ['categoria'],
    });
  
    if (!existing) {
      throw new Error('Subcategoría no encontrada');
    }
  
    // Si se incluye nueva categoría (como ID string), conviértela a objeto
    const updateData: Partial<SubCategory> = {
      ...dto,
      categoria: dto.categoria ? ({ id: dto.categoria } as Category) : existing.categoria,
    };
  
    const updated = this.subCategoryRepo.merge(existing, updateData);
    return this.subCategoryRepo.save(updated);
  }


  remove(id: string) {
    return this.subCategoryRepo.delete(id);
  }
}
