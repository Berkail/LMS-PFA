import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/core/common/validators/match.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'JohnUsername' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'JohnDoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678'})
  @IsNotEmpty()
  @IsString()
  plainPassword: string;

  @ApiProperty({ example: '12345678'})
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Match('plainPassword', { message: 'Passwords do not match' })
  confirmPlainPassword: string;
}
