import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credentials } from '../../Credentials/credentials.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: string;

  /**
   * Nombre del usuario.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  /**
   * Apellido del usuario.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastname: string;

  /**
   * Fecha de nacimiento del usuario.
   */
  @Column({
    type: 'date',
    nullable: false,
  })
  birthdate: Date;

  /**
   * Email del usuario.
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  /**
   * País de residencia del usuario.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  country: string;

  /**
   * Ciudad de residencia del usuario.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  city: string;

  /**
   * Pasaporte o DNI del usuario.
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  dni: string;

  /**
   * Indica si el usuario es premium.
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  isPremium: boolean;

  /**
   * Indica si el usuario es administrador.
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  /**
   * Relación de uno a uno con las credenciales del usuario.
   */
  @OneToOne(() => Credentials)
  @JoinColumn()
  credential: Credentials;
}
