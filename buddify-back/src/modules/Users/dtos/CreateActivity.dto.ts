import { IsNotEmpty, IsString, IsDateString, IsUrl, IsLatitude, IsLongitude, Length } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}
