import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'JohnUsername'})
  @IsString()
  username: string;

  @ApiProperty({ example: '12345678'})
  @IsString()
  plainPassword: string;
}
