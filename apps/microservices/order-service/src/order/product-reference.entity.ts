import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductReference {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar' })
  nombre!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: string;

  @Column({ type: 'boolean' })
  activo!: boolean;
}
