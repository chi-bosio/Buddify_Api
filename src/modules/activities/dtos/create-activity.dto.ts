import { IsNotEmpty, IsString, IsDateString, IsUUID, Length } from 'class-validator';

export class CreateActivityDto {
   /**
   * Nombre de la actividad.
   * Debe ser un string con una longitud máxima de 100 caracteres.
   * @example "Clase de Yoga al aire libre"
   */
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  /**
   * Descripción de la actividad.
   * Explica los detalles importantes sobre la actividad.
   * @example "Una clase de yoga para principiantes en el parque central."
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * URL de la imagen representativa de la actividad.
   * @example "https://example.com/imagenes/yoga.jpg"
   */
  @IsNotEmpty()
  @IsString()
  image: string;

  /**
   * Fecha en la que se realizará la actividad.
   * Formato ISO 8601 (YYYY-MM-DD).
   * @example "2024-12-01"
   */
  @IsNotEmpty()
  @IsDateString()
  date: string; 

  /**
   * Hora en la que se realizará la actividad.
   * Formato de 24 horas (HH:mm).
   * @example "10:00"
   */
  @IsNotEmpty()
  @IsString()
  time: string;

  /**
   * Lugar donde se llevará a cabo la actividad.
   * @example "Parque Central, Ciudad de México"
   */
  @IsNotEmpty()
  @IsString()
  place: string;

  /**
   * Latitud del lugar donde se llevará a cabo la actividad.
   * @example "19.432608"
   */
  @IsNotEmpty()
  @IsString()
  latitude: string;

  /**
   * Longitud del lugar donde se llevará a cabo la actividad.
   * @example "-99.13320"
   */
  @IsNotEmpty()
  @IsString()
  longitude: string;

  /**
   * Identificador único del usuario creador de la actividad.
   * Debe ser un UUID válido.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsNotEmpty()
  @IsUUID()
  creatorId: string; 
  /**
   * Identificador único de la categoria de la actividad.
   * Debe ser un UUID válido.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsNotEmpty()
  @IsUUID()
  categoryId: string; 
}