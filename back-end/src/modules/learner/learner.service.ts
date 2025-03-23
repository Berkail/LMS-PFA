import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { EncryptionInterface } from 'src/core/common/utils/encryption/encryption.interface';

@Injectable()
export class LearnerService extends UserService<Learner> {
  constructor(
    @Inject('ENCRYPTION_UTIL')
    protected readonly encryptionService: EncryptionInterface,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<Learner>,
    @InjectRepository(Learner)
    protected readonly repository: Repository<Learner>,
  ) {
    super(encryptionService, repository);
  }

  populate(user: Learner, createUserDto: CreateLearnerDto): void {
    super.populate(user, createUserDto);
    user.birthdate = createUserDto.birthdate;
  }

  async create(createLearnerDto: CreateLearnerDto) {
    try {
      const learner = new Learner();
      this.populate(learner, createLearnerDto);

      await this.repository.save(learner);

      const { hashedPassword, ...result } = learner;
      return result;
    } catch (error) {
      console.error('Error initializing user:', error);
      throw new InternalServerErrorException(
        'Failed to create learner. Please try again later.',
      );
    }
  }

  async findAll(params: CursorPaginationDto) {
    return await this.paginationService.paginate(this.repository, params);
  }

  async findById(id: number): Promise<Learner> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Learner> {
    return await super.findByUsername(username);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    try {
      const learner = await this.findById(id);
      if (!learner) {
        return null;
      }

      if (updateLearnerDto.plainPassword) {
        learner.hashedPassword = await this.encryptionService.hashSync(
          updateLearnerDto.plainPassword,
        );
      }

      const { plainPassword, ...updateData } = updateLearnerDto;

      Object.assign(learner, updateData);
      await this.repository.save(learner);

      const { hashedPassword, ...result } = learner;
      return result;
    } catch (error) {
      console.error('Error updating learner:', error);
      throw new InternalServerErrorException(
        'Failed to update learner. Please try again later.',
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }
}
