import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateLearnerDto extends CreateUserDto {
  birthdate: Date;
}
