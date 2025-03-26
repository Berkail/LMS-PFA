import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EncryptionInterface } from 'src/core/common/utils/encryption/encryption.interface';
import { Repository } from 'typeorm';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';

@Injectable()
export class UserService<T extends User> {
  constructor(
    @Inject('ENCRYPTION_UTIL')
    protected readonly encryptionUtil: EncryptionInterface,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<T>,
    protected readonly repository: Repository<T>,
  ) {}

  async populate(user: User, createUserDto: CreateUserDto): Promise<void> {
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.hashedPassword = await this.encryptionUtil.hash(
      createUserDto.plainPassword,
    );
  }

  async create(createUserDto: CreateUserDto): Promise<T> {
    try {
      const user = this.repository.create();
      await this.populate(user, createUserDto);
      await this.repository.save(user);

      const { hashedPassword, ...result } = user as any;
      return result as T;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Failed to create user. Please try again later.',
      );
    }
  }

  async findAll(params: CursorPaginationDto) {
    return await this.paginationService.paginate(this.repository, params);
  }

  async findById(id: number): Promise<T> {
    const user = await this.repository.findOne({
      where: { id } as any,
      select: ['hashedPassword'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user as T;
  }

  async findByUsername(username: string): Promise<T> {
    const user = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.hashedPassword')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with username: ${username} not found.`);
    }
    return user as T;
  }

  async update(id: number, updateUserDto: Partial<T>): Promise<T> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .addSelect('user.hashedPassword')
        .where('user.id = :id', { id })
        .getOne();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      if (updateUserDto['plainPassword']) {
        user['hashedPassword'] = await this.encryptionUtil.hashSync(
          updateUserDto['plainPassword'],
        );
        delete updateUserDto['plainPassword'];
      }

      Object.assign(user, updateUserDto);
      const updatedUser = await this.repository.save(user);

      const { hashedPassword, ...result } = updatedUser as any;
      return result as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating User:', error);
      throw new InternalServerErrorException(
        'Failed to update User. Please try again later.',
      );
    }
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
