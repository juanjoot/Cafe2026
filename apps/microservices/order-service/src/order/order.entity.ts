import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerEmail!: string;

  @Column('jsonb')
  items!: {
    id: string;
    name: string;
    origin: string;
  }[];

  @Column('decimal')
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;
}