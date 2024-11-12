import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credentials } from '../../Credentials/credentials.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar', 
    length: 100,      
    nullable: false,  
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastname: string;

  @Column({
    type: 'date',    
    nullable: false,  
  })
  birthdate: Date;

  @Column({
    type: 'varchar',
    length: 255,     
    unique: true,     
    nullable: false, 
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  dni: string;

  @Column({
    type: 'boolean',
    default: false,  
  })
  isPremium: boolean;

  @Column({
    type: 'boolean',
    default: false, 
  })
  isAdmin: boolean;

  @OneToOne(() => Credentials)
  @JoinColumn()  
  credential: Credentials;
}
