import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseElementDto } from './dto/create-course-element.dto';
import { UpdateCourseElementDto } from './dto/update-course-element.dto';
import { CourseElement } from './entities/course-element.entity';
import { Repository } from 'typeorm';
import { PaginationStrategy } from 'src/core/pagination/pagination-strategy.interface';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';
import { CourseElementMapper } from './mappers/course-element.mapper';

@Injectable()
export class CourseElementService<T extends CourseElement> {
  constructor(
    protected readonly courseElementMapper: CourseElementMapper,
    protected readonly repository: Repository<T>,
    @Inject('PAGINATION_SERVICE')
    protected readonly paginationService: PaginationStrategy<T>,
  ) {}

  async create(createCourseElementDto: CreateCourseElementDto): Promise<T> {
    return await this.repository.manager.transaction(async (manager) => {
      try {
        const courseElement = manager.getRepository(CourseElement).create();
        await this.courseElementMapper.toEntity(courseElement, createCourseElementDto);
        await manager.save(courseElement);
        return courseElement as T;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException("Couldn't create CourseElement");
      }
    });
  }

  async findAll(params: CursorPaginationDto) {
    return await this.paginationService.paginate(this.repository, params);
  }

  async findById(id: number): Promise<T> {
    try {
      return await this.repository.findOneOrFail({
        where: { id } as any,
      });
    } catch {
      throw new NotFoundException(`CourseElement with ID ${id} not found.`);
    }
  }

  async update(id: number, updateCourseElementDto: UpdateCourseElementDto): Promise<T> {
    return await this.repository.manager.transaction(async (manager) => {
      const courseElement = await this.findById(id);
      await this.courseElementMapper.toEntity(courseElement, updateCourseElementDto);
      return await manager.save(courseElement) as T;
    });
  }

  async remove(id: number): Promise<boolean> {
    return await this.repository.manager.transaction(async (manager) => {
      const courseElement: T = await this.findById(id);
      await manager.softRemove(courseElement);
      return true;
    });
  }
}
