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

@Injectable()
export class LearnerService {
  constructor(
    @InjectRepository(Learner)
    private readonly learnerRepo: Repository<Learner>,
    private readonly userService: UserService,
    @Inject('PAGINATION_SERVICE')
    private readonly paginationService: PaginationStrategy<Learner>,
  ) {}

  async create(createLearnerDto: CreateLearnerDto) {
    try {
      return await this.learnerRepo.manager.transaction(
        async (transactionalEntityManager) => {
          const learner = new Learner();
          this.userService.init_user(learner, createLearnerDto);
          learner.birthdate = createLearnerDto.birthdate;

          await transactionalEntityManager.save(learner);

          const { password, ...result } = learner;
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

  findAll(params: CursorPaginationDto) {
    return this.paginationService.paginate(this.learnerRepo, params);
  }

  findOne(id: number) {
    return `This action returns a #${id} learner`;
  }

  update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return `This action updates a #${id} learner`;
  }

  remove(id: number) {
    return `This action removes a #${id} learner`;
  }
}
