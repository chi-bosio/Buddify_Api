import { IsNotEmpty, IsUUID, IsString, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  @IsNotEmpty({ message: 'El ID de la actividad es obligatorio.' })
  activityId: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del creador es obligatorio.' })
  creatorName: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El ID del reportero es obligatorio.' })
  reporterId: string;

  @IsString()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  description: string;
}
