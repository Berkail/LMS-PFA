import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateLearnerDto extends CreateUserDto {
  @ApiProperty({ example: '1999-09-11' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  birthdate: Date;
}
