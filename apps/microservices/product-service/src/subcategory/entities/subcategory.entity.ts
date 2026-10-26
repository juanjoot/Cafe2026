// src/subcategory/entities/subcategory.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('subcategories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @ManyToOne(() => Category, (category) => category.subcategorias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria!: Category;

  @OneToMany(() => Product, (product) => product.subcategoria)
  products!: Product[];
}
