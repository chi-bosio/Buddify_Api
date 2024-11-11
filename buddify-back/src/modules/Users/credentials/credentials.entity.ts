import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
