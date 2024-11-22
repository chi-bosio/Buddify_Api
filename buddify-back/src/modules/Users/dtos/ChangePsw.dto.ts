import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class ChangePswDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

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

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
