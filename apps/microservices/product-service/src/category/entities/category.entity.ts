// src/product/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { SubCategory } from '../../subcategory/entities/subcategory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @OneToMany(() => Product, (product) => product.categoria)
  products!: Product[];

  @OneToMany(() => SubCategory, (sub) => sub.categoria, { cascade: true })
  subcategorias!: SubCategory[];
}
