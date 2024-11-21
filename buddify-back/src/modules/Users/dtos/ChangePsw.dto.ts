import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class ChangePswDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Debe incluir al menos una letra mayúscula.' })
  @Matches(/[0-9]/, { message: 'Debe incluir al menos un número.' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
