import { Activity } from "modules/activities/activity.entity";
import { Users } from "modules/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { eager: true })
  sender: Users;

  @ManyToOne(() => Activity, { eager: true })
  activity: Activity;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
