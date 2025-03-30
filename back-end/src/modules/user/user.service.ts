import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService<T extends User> {
  constructor(
    protected readonly userMapper: UserMapper,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<T>,
    protected readonly repository: Repository<T>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<T> {
    try {
      const user = this.repository.create();
      await this.userMapper.toEntity(user, createUserDto);
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
    return await this.repository
      .findOneOrFail({
        where: { id } as any,
      })
      .catch(() => {
        throw new NotFoundException(`User with ID ${id} not found.`);
      });
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
    const user = await this.findById(id);

    await this.userMapper.toEntity(user, updateUserDto);

    await this.repository.save(user);
    return user;
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findById(id);
    await this.repository.softRemove(user);
    return true;
  }
}
