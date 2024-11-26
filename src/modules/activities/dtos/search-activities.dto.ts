import { IsOptional, IsDateString, IsUUID, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchActivitiesDto {
  /**
   * Latitud del punto central desde el cual buscar actividades.
   * Debe ser un número representando coordenadas geográficas.
   */
  @ApiProperty({
    description: 'Latitud del punto central desde el cual buscar actividades.',
    example: -34.603722,
  })
  @IsString()
  latitude: string;

  /**
   * Longitud del punto central desde el cual buscar actividades.
   * Debe ser un número representando coordenadas geográficas.
   */
  @ApiProperty({
    description: 'Longitud del punto central desde el cual buscar actividades.',
    example: -58.381592,
  })
  @IsString()
  longitude: string;

  /**
   * Radio de búsqueda en kilómetros.
   * Opcional, por defecto se considera un radio de búsqueda predefinido en el backend.
   */
  @ApiPropertyOptional({
    description: 'Radio de búsqueda en kilómetros.',
    example: 10,
  })
  @IsOptional()
  @IsString()
  radius?: string;

  /**
   * Categoría de la actividad para filtrar los resultados.
   * Debe ser el nombre de una categoría existente.
   */
  @ApiPropertyOptional({
    description: 'Categoría de la actividad para filtrar los resultados.',
    example: 'Deportes',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  /**
   * Fecha de inicio del rango de búsqueda de actividades (formato ISO 8601).
   * Opcional, para filtrar actividades disponibles desde una fecha específica.
   */
  @ApiPropertyOptional({
    description: 'Fecha de inicio del rango de búsqueda de actividades (formato ISO 8601).',
    example: '2024-11-20',
  })
  @IsOptional()
  @IsDateString()
  dateStart?: string;

  /**
   * Fecha de fin del rango de búsqueda de actividades (formato ISO 8601).
   * Opcional, para filtrar actividades disponibles hasta una fecha específica.
   */
  @ApiPropertyOptional({
    description: 'Fecha de fin del rango de búsqueda de actividades (formato ISO 8601).',
    example: '2024-11-25',
  })
  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  /**
   * Página de los resultados para paginación.
   * Opcional, por defecto es la primera página.
   */
  @ApiPropertyOptional({
    description: 'Página de los resultados para paginación.',
    example: 1,
  })
  @IsOptional()
  @IsString()
  page?: string;

  /**
   * Límite de resultados por página para paginación.
   * Opcional, por defecto se utiliza un límite predefinido en el backend.
   */
  @ApiPropertyOptional({
    description: 'Límite de resultados por página para paginación.',
    example: 10,
  })
  @IsOptional()
  @IsString()
  limit?: string;

  @IsUUID()
  userId:string
}
