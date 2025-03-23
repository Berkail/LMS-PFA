import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UserService } from '../user/user.service';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { EncryptionInterface } from 'src/core/common/utils/encryption/encryption.interface';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { Learner } from '../learner/entities/learner.entity';

@Injectable()
export class InstructorService extends UserService<Instructor> {
  constructor(
    @Inject('ENCRYPTION_UTIL')
    protected readonly encryptionService: EncryptionInterface,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<Instructor>,
    @InjectRepository(Instructor)
    protected readonly repository: Repository<Instructor>,
  ) {
    super(encryptionService, repository);
  }

  async create(createInstructorDto: CreateInstructorDto) {
    try {
      const instructor = new Instructor();
      this.populate(instructor, createInstructorDto);

      await this.repository.save(instructor);

      const { hashedPassword, ...result } = instructor;
      return result;
    } catch (error) {
      console.error('Error initializing Instuctor:', error);
      throw new InternalServerErrorException(
        'Failed to create Instructor. Please try again later.',
      );
    }
  }

  async findAll(params: CursorPaginationDto) {
    return await this.paginationService.paginate(this.repository, params);
  }

  async findById(id: number): Promise<Instructor> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Instructor> {
    return await super.findByUsername(username);
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    try {
      const instructor = await this.findById(id);
      if (!Instructor) {
        return null;
      }

      if (updateInstructorDto.plainPassword) {
        instructor.hashedPassword = await this.encryptionService.hashSync(
          updateInstructorDto.plainPassword,
        );
      }

      const { plainPassword, ...updateData } = updateInstructorDto;

      Object.assign(instructor, updateData);
      await this.repository.save(instructor);

      const { hashedPassword, ...result } = instructor;
      return result;
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw new InternalServerErrorException(
        'Failed to update instructor. Please try again later.',
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }
}
