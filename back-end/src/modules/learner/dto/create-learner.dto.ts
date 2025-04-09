import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateLearnerDto extends CreateUserDto {
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  birthdate: Date;
}
