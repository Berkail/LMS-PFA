import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { EncryptionInterface } from 'src/core/common/utils/encryption/encryption.interface';

@Injectable()
export class UserMapper {
  constructor(
    @Inject('ENCRYPTION_UTIL')
    private readonly encryptionService: EncryptionInterface,
  ) {}

  async toEntity(entity: User, dto: Partial<CreateUserDto>): Promise<User> {
    if (dto.firstName) entity.firstName = dto.firstName.toLowerCase();
    if (dto.lastName) entity.lastName = dto.lastName.toLowerCase();
    if (dto.username) entity.username = dto.username;
    if (dto.email) entity.email = dto.email;

    if (
      dto.plainPassword &&
      !(await this.isPasswordSame(entity.hashedPassword, dto.plainPassword))
    ) {
      entity.hashedPassword = await this.encryptionService.hash(
        dto.plainPassword,
      );
    }

    return entity;
  }

  private async isPasswordSame(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    if (!hashedPassword) return false;
    return await this.encryptionService.compare(plainPassword, hashedPassword);
  }
}
