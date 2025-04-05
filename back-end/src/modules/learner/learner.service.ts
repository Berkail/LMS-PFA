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
    super(encryptionService, paginationService, repository);
  }

  async populate(
    learner: Learner,
    createLearnerDto: CreateLearnerDto,
  ): Promise<void> {
    await super.populate(learner, createLearnerDto);
    learner.birthdate = createLearnerDto.birthdate;
  }

  async create(createLearnerDto: CreateLearnerDto) {
    createLearnerDto = {
      firstName: 'hihi',
      lastName: 'toto',
      username: 'simi',
      email: 'bibi@gg.com',
      plainPassword: 'timy now',
      birthdate: new Date('1999-05-09'),
    };
    return await super.create(createLearnerDto);
  }

  async findAll(params: CursorPaginationDto) {
    return await super.findAll(params);
  }

  async findById(id: number): Promise<Learner> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Learner> {
    return await super.findByUsername(username);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return await super.update(id, updateLearnerDto);
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }
}
