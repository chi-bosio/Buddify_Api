import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Users } from '../users/users.entity';
import { Category } from '../categories/category.entity';
import { ActivityStatus } from './enums/ActivityStatus.enum';

@Entity({
  name: "activities",
})
export class Activity {
  /**
   * Identificador único de la actividad.
   * Generado automáticamente como un UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre de la actividad.
   * Debe ser un string con una longitud máxima de 100 caracteres.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  name: string;

  /**
   * Descripción de la actividad.
   * Proporciona detalles importantes sobre la actividad.
   */
  @Column({
    type: 'text',
    nullable: false
  })
  description: string;

  /**
   * URL de la imagen que representa la actividad.
   */
  @Column({
    type: 'text',
    nullable: false
  })
  image: string;

  /**
   * Fecha en la que se realizará la actividad.
   * Formato ISO 8601 (YYYY-MM-DD).
   */
  @Column({
    type: 'date',
    nullable: false
  })
  date: Date;

  /**
   * Hora en la que se realizará la actividad.
   * Formato de 24 horas (HH:mm).
   */
  @Column({
    type: 'varchar',
    nullable: false
  })
  time: string;

  /**
   * Lugar donde se llevará a cabo la actividad.
   */
  @Column({
    type: 'varchar',
    nullable: false
  })
  place: string;

  /**
   * Latitud de la ubicación donde se llevará a cabo la actividad.
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  latitude: string;

  /**
   * Longitud de la ubicación donde se llevará a cabo la actividad.
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  longitude: string;

  /**
   * Usuario creador de la actividad.
   * Relación con la entidad `Users`.
   */
  @ManyToOne(() => Users, (user) => user.activities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  creator: Users;
  
  /**
   * Relación con la entidad `Category`.
   * Una actividad tiene una categoría.
   */
  @ManyToOne(() => Category, (category) => category.activities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  category: Category;

   /**
   * Relación de muchos a muchos con los usuarios que participan en la actividad.
   */
  @ManyToMany(() => Users, (user) => user.participatedActivities)
  @JoinTable({
    name: 'user_activity',
    joinColumn: { name: 'activityId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  participants: Users[];

  /**
   * Estado de la actividad.
   * Puede ser "pending", "confirmed" o "cancelled".
   */
  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.PENDING,
})
  status: ActivityStatus;
}