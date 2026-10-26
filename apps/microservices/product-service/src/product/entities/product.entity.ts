import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../subcategory/entities/subcategory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column('text')
  descripcion!: string;

  @Column('numeric', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  stock!: number;

  @Column({ default: false })
  destacado!: boolean;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku!: string;

  @Column({ default: true })
  activo!: boolean;

  @Column('text', { nullable: true })
  imagen1?: string;

  @Column('text', { nullable: true })
  imagen2?: string;

  @Column('text', { nullable: true })
  imagen3?: string;

  @Column('text', { nullable: true })
  imagen4?: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column({ name: 'vendidos', default: 0 })
  vendidos!: number;

  @Column({ name: 'calificacion_promedio', type: 'float', default: 0 })
  calificacionPromedio!: number;

  @Column({ name: 'numero_resenas', default: 0 })
  numeroResenas!: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria!: Category;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'subcategoria_id' })
  subcategoria?: SubCategory | null;
}
