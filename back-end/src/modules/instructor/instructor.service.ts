import { Inject, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UserService } from '../user/user.service';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructorMapper } from './mappers/instructor.mapper';
import { paginate, PaginateConfig, Paginated, PaginateQuery, PaginationType } from 'nestjs-paginate';

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
    const config: PaginateConfig<Instructor> = {
      sortableColumns: ['id', 'createdAt', 'username'],
      searchableColumns: ['firstName', 'lastName', 'username', 'email'],
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
      
      relations: ['courses'],
    };

    return paginate(query, this.instructorRepo, config);
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
