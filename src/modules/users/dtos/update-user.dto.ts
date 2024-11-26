import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsEmail,
  IsUUID,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * Identificador único del usuario.
   */
  @IsUUID()
  @IsOptional()
  id?: string;

  /**
   * Nombre del usuario.
   */
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  /**
   * Apellido del usuario.
   */
  @IsString()
  @Length(1, 100)
  @IsOptional()
  lastname?: string;

  /**
   * Fecha de nacimiento del usuario.
   */
  @IsDateString()
  @IsOptional()
  birthdate?: Date;

  /**
   * Email del usuario.
   */
  @IsEmail()
  @Length(1, 255)
  @IsOptional()
  email?: string;

  /**
   * País de residencia del usuario.
   */
  @IsString()
  @Length(1, 100)
  @IsOptional()
  country?: string;

  /**
   * Ciudad de residencia del usuario.
   */
  @IsString()
  @Length(1, 100)
  @IsOptional()
  city?: string;

  /**
   * Pasaporte o DNI del usuario.
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  dni?: string;

  /**
   * Indica si el usuario es premium.
   */
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  /**
   * Indica si el usuario es administrador.
   */
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  /**
   * URL del avatar del usuario.
   */
  @IsString()
  @IsOptional()
  avatar?: string;
}
