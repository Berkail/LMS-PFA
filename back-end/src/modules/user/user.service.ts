import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService<T extends User> {
  constructor(
    protected readonly userMapper: UserMapper,
    protected readonly repository: Repository<T>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<T> {
    return await this.repository.manager.transaction(async (manager) => {
      try {
        const user: T = this.repository.create();
        await this.userMapper.toEntity(user, createUserDto);
        await manager.save(user);

        const { hashedPassword, ...result } = user as any;
        return result as T;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new InternalServerErrorException(
          'Failed to create user. Please try again later.',
        );
      }
    });
  }

  async findById(id: number): Promise<T> {
    try {
      return await this.repository.findOneOrFail({
        where: { id } as any,
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
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

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<T> {
    return await this.repository.manager.transaction(async (manager) => {
      const user = await this.findById(id);
      await this.userMapper.toEntity(user, updateUserDto);
      return (await manager.save(user)) as T;
    });
  }

  async remove(id: number): Promise<boolean> {
    const user: T = await this.findById(id);
    await this.repository.softRemove(user);
    return true;
  }
}
