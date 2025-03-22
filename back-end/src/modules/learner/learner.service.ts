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

  async create(createLearnerDto: CreateLearnerDto) {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const learner = new Learner();
          super.init_user(learner, createLearnerDto);
          learner.birthdate = createLearnerDto.birthdate;

          await transactionalEntityManager.save(learner);

          const { hashedPassword, ...result } = learner;
          return result;
        },
      );
    } catch (error) {
      console.error('Error initializing user:', error);
      throw new InternalServerErrorException(
        'Failed to create learner. Please try again later.',
      );
    }
  }

  async findAll(params: CursorPaginationDto) {
    console.log('params:', params);
    return await this.paginationService.paginate(this.repository, params);
  }

  async findById(id: number): Promise<Learner> {
    return await super.findById(id);
  }

  async findByUsername(email: string): Promise<Learner> {
    return await super.findByUsername(email);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    try {
      const learner = await this.findById(id);
      if (!learner) {
        return null;
      }

      Object.assign(learner, updateLearnerDto);
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

  async remove(id: number) {
    try {
      const result = await this.repository.softDelete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error removing learner:', error);
      throw new InternalServerErrorException(
        'Failed to remove learner. Please try again later.',
      );
    }
  }
}
