import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EncryptionInterface } from 'src/core/common/utils/encryption/encryption.interface';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class UserService<T extends ObjectLiteral> {
  constructor(
    @Inject('ENCRYPTION_UTIL')
    protected readonly encryptionUtil: EncryptionInterface,
    protected readonly repository: Repository<T>,
  ) {}

  populate(user: User, createUserDto: CreateUserDto): void {
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.hashedPassword = this.encryptionUtil.hashSync(
      createUserDto.plainPassword,
    );
  }

  async findById(id: number): Promise<T> {
    const user = await this.repository.findOne({ where: { id } as any });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<T> {
    const user = await this.repository.findOne({ where: { username } as any });
    if (!user) {
      throw new NotFoundException(
        `User with username:  ${username} not found.`,
      );
    }
    return user as T;
  }

  async remove(id: number): Promise<boolean> {
    try {
      const result = await this.repository.softDelete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error removing learner:', error);
      throw new InternalServerErrorException(
        'Failed to remove User. Please try again later.',
      );
    }
  }
}
