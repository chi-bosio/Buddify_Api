import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column()
  planId: string;

  @Column()
  planName: string;

  @Column('int')
  amount: number;

  @Column()
  currency: string;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  clientSecret: string;

  @Column({ default: 'pending' })
  status: string;
}
