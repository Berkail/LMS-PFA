import { Injectable, Inject } from '@nestjs/common';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { LearnerMapper } from './mappers/learner.mapper';

@Injectable()
export class LearnerService extends UserService<Learner> {
  constructor(
    protected readonly learnerMapper: LearnerMapper,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<Learner>,
    @InjectRepository(Learner)
    protected readonly repository: Repository<Learner>,
  ) {
    super(learnerMapper, paginationService, repository);
  }

  async create(createLearnerDto: CreateLearnerDto) {
    return await super.create(createLearnerDto);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return await super.update(id, updateLearnerDto);
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
