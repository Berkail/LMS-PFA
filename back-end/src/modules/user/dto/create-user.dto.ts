import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from 'src/core/common/validators/match.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  plainPassword: string;

  @IsNotEmpty()
  @IsString()
  @Match('plainPassword', { message: 'Passwords do not match' })
  confirmPlainPassword: string;
}
