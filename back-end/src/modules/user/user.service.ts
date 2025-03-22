import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('ENCRYPTION_UTIL') private readonly encryptionUtil) {}

  init_user(user: User, createUserDto: CreateUserDto): void {
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.hashedPassword = this.encryptionUtil.hashSync(createUserDto.plainPassword);
  }
}
