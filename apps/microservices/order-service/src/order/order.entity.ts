import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'varchar', nullable: true })
  customerId!: string | null;

  @Column({ name: 'customer_email', type: 'varchar', nullable: true })
  customerEmail!: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];
}