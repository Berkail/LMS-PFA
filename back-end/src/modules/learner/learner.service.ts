import { Injectable, Inject } from '@nestjs/common';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LearnerMapper } from './mappers/learner.mapper';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';

@Injectable()
export class LearnerService extends UserService<Learner> {
  constructor(
    protected readonly learnerMapper: LearnerMapper,
    @InjectRepository(Learner)
    protected readonly learnerRepo: Repository<Learner>,
  ) {
    super(learnerMapper, learnerRepo);
  }

  async create(createLearnerDto: CreateLearnerDto) {
    return await super.create(createLearnerDto);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return await super.update(id, updateLearnerDto);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Learner>> {
    const config: PaginateConfig<Learner> = {
      sortableColumns: ['id', 'createdAt', 'birthdate'],
      searchableColumns: ['firstName', 'lastName', 'username', 'email'],
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
    };

    return paginate(query, this.learnerRepo, config);
  }

  async findById(id: number): Promise<Learner> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Learner> {
    return await super.findByUsername(username);
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }
}
