import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @Column()
  creatorName: string;

  @Column()
  reporterId: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  reportedAt: Date;
}
