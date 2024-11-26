import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from '../activities/activity.entity';

@Entity('categories')
export class Category {
  /**
   * ID de la categoría.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Nombre de la categoría.
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name: string;

  /**
   * Relación de uno a muchos entre esta categoría y las actividades que le pertenecen.
   */
  @OneToMany(() => Activity, (activity) => activity.category)
  activities: Activity[];
}
