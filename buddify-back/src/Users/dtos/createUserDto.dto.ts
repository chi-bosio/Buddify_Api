import { IsDate, IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastname: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthdate: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{7,20}$/, { message: 'El dni debe tener entre 7 y 20 dígitos' })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  })
  password: string;
}
