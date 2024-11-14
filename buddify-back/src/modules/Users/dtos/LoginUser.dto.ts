import { IsNotEmpty, IsString, Length} from 'class-validator';

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
  password: string;
}
