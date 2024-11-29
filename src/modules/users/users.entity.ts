import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credentials } from '../credentials/credentials.entity';
import { Activity } from '../activities/activity.entity';

@Entity()
export class Users {
  /**
   * ID del usuario.
   */
  @PrimaryGeneratedColumn('uuid')
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
    type: 'varchar',
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

  /**
   * Relación de uno a muchos con las actividades creadas por el usuario.
   */
  @OneToMany(() => Activity, (activity) => activity.creator)
  activities: Activity[];

  /**
   * Relación de muchos a muchos con las actividades en las que el usuario es participante.
   */
  @ManyToMany(() => Activity, (activity) => activity.participants)
  @JoinTable({
    name: 'user_activity',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'activityId', referencedColumnName: 'id' },
  })
  participatedActivities: Activity[];

  /**
   * Avatar del usuario.
   */
  @Column({
    default:
      'https://res.cloudinary.com/dtlmrtzpa/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1731928071/avatar16_dsdi8v.png',
    nullable: false,
  })
  avatar: string;
}
