import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;
}
