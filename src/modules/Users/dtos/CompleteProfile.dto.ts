import {
    IsDate,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CompleteProfileDto {
   /**
     * Fecha de nacimiento del usuario.
     * @example "1990-01-01"
     */
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    birthdate: Date;
  
  
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
  
  }
  