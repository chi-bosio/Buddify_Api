import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class ChangePswDto {
  /**
   * Contraseña actual del usuario.
   */
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  /**
   * Nueva contraseña del usuario.
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
  newPassword: string;

  /**
   * Confirmación de la nueva contraseña.
   */
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
