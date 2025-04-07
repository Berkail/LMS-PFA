import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class CourseService {
  constructor(
    private readonly courseMapper: CourseMapper,
    @InjectRepository(Course)
    protected readonly courseRepo: Repository<Course>,
    private readonly instructorService: InstructorService,
    private readonly sessionService: SessionService,
  ) {}

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
    req: Request,
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    try {
      createCourseDto.pathToImg = `/uploads/img/${file.filename}`;

      const instructor : Instructor | null = await this.getInstructorFromSession(req);
      if (!instructor) { 
        throw new NotFoundException('Instructor not found in session');
      }

      const course: Course = this.courseRepo.create();
      this.courseMapper.toEntity(course, createCourseDto);
      course.instructor = instructor;

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
      updateCourseDto.pathToImg = `/uploads/img/${file.filename}`;
    }

    const updatedCourse = this.courseRepo.merge(course, updateCourseDto);
    return await this.courseRepo.save(updatedCourse);
  }

  async findById(id: number): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async remove(id: number): Promise<void> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    await this.courseRepo.delete(id);
  }

  async getInstructorFromSession(req: Request): Promise<Instructor | null> {
    const instructorId = this.sessionService.getSession(req, 'user')?.id;
    if (!instructorId) {
      throw new NotFoundException('Instructor not found in session');
    }
    const instructor = await this.instructorService.findById(instructorId);
    if (!instructor) {
      throw new NotFoundException('Instructor not found in database');
    }
    return instructor;
  }
  
}
