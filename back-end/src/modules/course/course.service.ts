import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { Request } from 'express';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseMapper } from './mappers/course.mapper';
import { InstructorService } from '../instructor/instructor.service';
import { SessionService } from 'src/core/session/session.service';
import { Instructor } from '../instructor/entities/instructor.entity';
import { CourseElementService } from '../course-element/course-element.service';
import { IMG_UPLOAD_DIR } from 'src/core/common/const/lms.const';

@Injectable()
export class CourseService extends CourseElementService<Course> {
  constructor(
    private readonly courseMapper: CourseMapper,
    @InjectRepository(Course)
    protected readonly courseRepo: Repository<Course>,
    private readonly instructorService: InstructorService,
    private readonly sessionService: SessionService,
  ) {
    super(courseRepo);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Course>> {
    const config: PaginateConfig<Course> = {
      sortableColumns: ['id', 'createdAt', 'publishedAt'],
      searchableColumns: ['title', 'difficulty'],
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
    };

    return paginate(query, this.courseRepo, config);
  }

  async create(
    instructor,
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    try {
      createCourseDto.pathToImg = `${IMG_UPLOAD_DIR}${file.filename}`;

      const course: Course = this.courseRepo.create();
      this.courseMapper.toEntity(course, createCourseDto);
      course.instructorId = instructor.id;

      return await this.courseRepo.save(course);
    } catch (error) {
      throw new BadRequestException('Error creating course: ' + error.message);
    }
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    if (file) {
      updateCourseDto.pathToImg = `${IMG_UPLOAD_DIR}${file.filename}`;
    }

    const updatedCourse = this.courseRepo.merge(course, updateCourseDto);
    return await this.courseRepo.save(updatedCourse);
  }

  async findById(id: number): Promise<Course> {
    try {
      return await super.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Course with id ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await super.remove(id);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Could not delete course element.',
        );
      }
      throw error;
    }
  }
}
