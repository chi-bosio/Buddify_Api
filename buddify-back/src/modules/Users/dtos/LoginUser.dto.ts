import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginUserDto {
  /**
   * Nombre de usuario.
   * @example "jdoe"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

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
