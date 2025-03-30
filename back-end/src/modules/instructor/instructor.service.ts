import { Inject, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UserService } from '../user/user.service';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { InstructorMapper } from './mappers/instructor.mapper';

@Injectable()
export class InstructorService extends UserService<Instructor> {
  constructor(
    protected readonly instructorMapper: InstructorMapper,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<Instructor>,
    @InjectRepository(Instructor)
    protected readonly repository: Repository<Instructor>,
  ) {
    super(instructorMapper, paginationService, repository);
  }

  async create(createInstructorDto: CreateInstructorDto) {
    return await super.create(createInstructorDto);
  }

  async findAll(params: CursorPaginationDto) {
    return await super.findAll(params);
  }

  async findById(id: number): Promise<Instructor> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Instructor> {
    return await super.findByUsername(username);
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return await super.update(id, updateInstructorDto);
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }
}
