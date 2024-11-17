import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({
  name: "activities",
})
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false
  })
  image: string;

  @Column({
    type: 'date',
    nullable: false
  })
  date: Date;

  @Column({
    type: 'varchar',
    nullable: false
  })
  time: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  place: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  latitude: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  longitude: string;

  @ManyToOne(() => Users, (user) => user.activities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  creator: Users;
}
