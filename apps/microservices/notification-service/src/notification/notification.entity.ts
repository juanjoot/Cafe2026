import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
class OrderReference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

@Entity('payments')
class PaymentReference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

@Entity('notifications')
export class NotificationRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId!: string | null;

  @Column({ name: 'payment_id', type: 'uuid', nullable: true })
  paymentId!: string | null;

  @Column({ name: 'event_type', type: 'varchar', length: 100, nullable: true })
  eventType!: string | null;

  @Column({ type: 'varchar' })
  recipient!: string;

  @Column({ type: 'varchar' })
  subject!: string;

  @Column({ type: 'text', default: '' })
  body!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: string;

  @Column({ name: 'provider_message_id', type: 'varchar', nullable: true })
  providerMessageId!: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt!: Date | null;

  @ManyToOne(() => OrderReference, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderReference | null;

  @ManyToOne(() => PaymentReference, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payment_id' })
  payment!: PaymentReference | null;
}

export { OrderReference, PaymentReference };
