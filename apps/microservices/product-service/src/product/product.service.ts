import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Category } from '../category/entities/category.entity'; // ✅ importa Category
import { NotFoundException } from '@nestjs/common';

// product.service.ts
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)  // ✅ aquí lo inyectas
    private readonly categoryRepo: Repository<Category>,
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
      relations: ['categoria'],
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
  
    // Crear entidad Product a partir del DTO
    const newProduct = this.productRepo.create({
      ...dto,
      categoria, // ✅ asignamos la entidad completa (o { id: dto.categoria } también es válido)
    });
  
    return this.productRepo.save(newProduct);
  }
  
  
  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.productRepo.findOne({
      where: { id },
      relations: ['categoria'],
    });
  
    if (!existing) {
      throw new Error('Producto no encontrado');
    }
  
    const updatedData: Partial<Product> = {
      ...dto,
      // Aquí convertimos correctamente el string ID a objeto { id }
      categoria: dto.categoria ? ({ id: dto.categoria } as Category) : existing.categoria,
    };
  
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
    relations: ['categoria'],
  });

  if (!product) {
    throw new NotFoundException(`Producto con id ${id} no encontrado`);
  }

  return product;
 }

}

