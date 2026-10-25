import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SubCategory } from '../subcategory/entities/subcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
  ) {}

  async create(dto: CreateCategoryDto) {
    let subcategorias: SubCategory[] = [];

    if (dto.subcategorias && dto.subcategorias.length > 0) {
      subcategorias = await this.subCategoryRepo.findBy({
        id: In(dto.subcategorias),
      });
    }

    const category = this.categoryRepo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      subcategorias,
    });

    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({ relations: ['subcategorias'] });
  }

  findOne(id: string) {
    return this.categoryRepo.findOne({
      where: { id },
      relations: ['subcategorias'],
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepo.findOneBy({ id });
    if (!existingCategory) {
      throw new Error('Categoría no encontrada');
    }

    let subcategorias: SubCategory[] = existingCategory.subcategorias;

    if (dto.subcategorias) {
      subcategorias = await this.subCategoryRepo.findBy({
        id: In(dto.subcategorias),
      });
    }

    const updated = this.categoryRepo.merge(existingCategory, {
      ...dto,
      subcategorias,
    });

    return this.categoryRepo.save(updated);
  }

  remove(id: string) {
    return this.categoryRepo.delete(id);
  }
}
