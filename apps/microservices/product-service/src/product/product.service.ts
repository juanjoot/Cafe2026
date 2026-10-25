import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Category } from '../category/entities/category.entity'; // ✅ importa Category
import { SubCategory } from '../subcategory/entities/subcategory.entity';
import { NotFoundException } from '@nestjs/common';

// product.service.ts
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)  // ✅ aquí lo inyectas
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
  ) {}

  async findAll(query: QueryProductDto) {
    const where: any = {};

    if (query.destacado !== undefined) {
      where.destacado = query.destacado === 'true';
    }
    
    if (query.activo !== undefined) {
      where.activo = query.activo === 'true';
    }
    
    if (query.categoria) {
      where.categoria = { id: query.categoria };
    }
    
    if (query.q) {
      where.nombre = ILike(`%${query.q}%`);
    }
    
    if (query.precioMin || query.precioMax) {
      where.precio = Between(
        Number(query.precioMin ?? 0),
        Number(query.precioMax ?? Number.MAX_SAFE_INTEGER),
      );
    }
  
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;
  
    const [data, total] = await this.productRepo.findAndCount({
      where,
      relations: ['categoria', 'subcategoria'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  
    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
  

  async create(dto: CreateProductDto) {
    // Validar existencia de la categoría por ID
    const categoria = await this.categoryRepo.findOneBy({ id: dto.categoria });
  
    if (!categoria) {
      throw new Error('Categoría no válida');
    }

    let subcategoria: SubCategory | null = null;
    if (dto.subcategoria) {
      const requestedSubcategory = await this.subCategoryRepo.findOne({
        where: { id: dto.subcategoria },
        relations: ['categoria'],
      });

      if (!requestedSubcategory || requestedSubcategory.categoria.id !== categoria.id) {
        throw new BadRequestException(
          'La subcategoría no existe o no pertenece a la categoría indicada',
        );
      }

      subcategoria = requestedSubcategory;
    }
  
    // Crear entidad Product a partir del DTO
    const newProduct = this.productRepo.create({
      ...dto,
      categoria, // ✅ asignamos la entidad completa (o { id: dto.categoria } también es válido)
      subcategoria,
    });
  
    return this.productRepo.save(newProduct);
  }
  
  
  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.productRepo.findOne({
      where: { id },
      relations: ['categoria', 'subcategoria'],
    });
  
    if (!existing) {
      throw new Error('Producto no encontrado');
    }
  
    const categoria = dto.categoria
      ? await this.categoryRepo.findOneBy({ id: dto.categoria })
      : existing.categoria;

    if (!categoria) {
      throw new BadRequestException('Categoría no válida');
    }

    let subcategoria = existing.subcategoria ?? null;
    if (dto.subcategoria) {
      const requestedSubcategory = await this.subCategoryRepo.findOne({
        where: { id: dto.subcategoria },
        relations: ['categoria'],
      });

      if (!requestedSubcategory || requestedSubcategory.categoria.id !== categoria.id) {
        throw new BadRequestException(
          'La subcategoría no existe o no pertenece a la categoría indicada',
        );
      }

      subcategoria = requestedSubcategory;
    } else if (existing.subcategoria && existing.subcategoria.categoria.id !== categoria.id) {
      throw new BadRequestException(
        'Debe indicar una subcategoría que pertenezca a la nueva categoría',
      );
    }

    const { subcategoria: _subcategoryId, categoria: _categoryId, ...fields } = dto;
    const updatedData: Partial<Product> = { ...fields, categoria, subcategoria };
  
    const updated = this.productRepo.merge(existing, updatedData);
    return this.productRepo.save(updated);
  }
  
  
  async remove(id: string) {
    await this.productRepo.delete(id);
    return { message: 'Producto eliminado' };
  }

  async findOne(id: string): Promise<Product> {
  const product = await this.productRepo.findOne({
    where: { id },
    relations: ['categoria', 'subcategoria'],
  });

  if (!product) {
    throw new NotFoundException(`Producto con id ${id} no encontrado`);
  }

  return product;
 }

}
