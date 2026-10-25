// src/subcategory/entities/subcategory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('subcategories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @ManyToOne(() => Category, (category) => category.subcategorias)
  @JoinColumn({ name: 'categoria_id' })
  categoria!: Category;
}
