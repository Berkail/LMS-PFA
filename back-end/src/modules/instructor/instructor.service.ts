import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UserService } from '../user/user.service';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructorMapper } from './mappers/instructor.mapper';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';

@Injectable()
export class InstructorService extends UserService<Instructor> {
  constructor(
    protected readonly instructorMapper: InstructorMapper,
    @InjectRepository(Instructor)
    protected readonly instructorRepo: Repository<Instructor>,
  ) {
    super(instructorMapper, instructorRepo);
  }

  async create(createInstructorDto: CreateInstructorDto) {
    return await super.create(createInstructorDto);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Instructor>> {
    const queryBuilder = this.instructorRepo
      .createQueryBuilder('instructor')
      .select([
        'instructor.id',
        'instructor.firstName',
        'instructor.lastName',
        'instructor.username',
        'instructor.email',
        'instructor.createdAt',
        'instructor.deletedAt',
      ]);

    const config: PaginateConfig<Instructor> = {
      sortableColumns: ['id', 'createdAt', 'username'],
      searchableColumns: ['firstName', 'lastName', 'username', 'email'],
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
    };

    return paginate(query, queryBuilder, config);
  }

  async findById(id: number): Promise<Instructor> {
    const instructors = await this.instructorRepo
      .createQueryBuilder('instructor')
      .select([
        'instructor.id',
        'instructor.firstName',
        'instructor.lastName',
        'instructor.username',
        'instructor.email',
        'instructor.createdAt',
        'instructor.deletedAt',
      ])
      .where('instructor.id = :id', { id })
      .getOne();

    if (!instructors) {
      throw new NotFoundException(`instructor with ID ${id} not found`);
    }

    return instructors;
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
