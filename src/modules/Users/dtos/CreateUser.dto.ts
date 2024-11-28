import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  /**
   * Nombre del usuario.
   * @example "Juan"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  /**
   * Nombre de usuario.
   * @example "jdoe"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  /**
   * Apellido del usuario.
   * @example "Perez"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastname: string;

  /**
   * Fecha de nacimiento del usuario.
   * @example "1990-01-01"
   */
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthdate: Date;

  /**
   * Email del usuario.
   * @example "user@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * País de residencia del usuario.
   * @example "Argentina"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  country: string;

  /**
   * Ciudad de residencia del usuario.
   * @example "Buenos Aires"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  city: string;

  /**
   * Documento nacional de identidad (DNI) del usuario.
   * Debe tener entre 7 y 20 dígitos.
   * @example "123456789"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{7,20}$/, {
    message: 'El dni debe tener entre 7 y 20 dígitos',
  })
  dni: string;

  /**
   * Contraseña del usuario.
   * Debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
   * @example "Example123!"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
    },
  )
  password: string;
}
