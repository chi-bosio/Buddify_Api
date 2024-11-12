import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users.entity';

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',  
    length: 150,      
    nullable: false,  
    unique: true,     
  })
  username: string;

  @Column({
    type: 'varchar',  
    length: 255,     
    nullable: false, 
  })
  password: string;

  @OneToOne(() => Users, (user) => user.credential)
  user: Users; 
}
