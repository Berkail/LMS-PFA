import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { Course } from './entities/course.entity';
import { Repository, UnorderedBulkOperation } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseMapper } from './mappers/course.mapper';
import { CourseElementService } from '../course-element/course-element.service';
import { IMG_UPLOAD_DIR } from 'src/core/common/const/lms.const';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class CourseService extends CourseElementService<Course> {
  constructor(
    private readonly courseMapper: CourseMapper,
    @InjectRepository(Course)
    protected readonly courseRepo: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
  ) {
    super(courseRepo);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Course>> {
    const config: PaginateConfig<Course> = {
      sortableColumns: ['id', 'createdAt', 'publishedAt'],
      searchableColumns: ['title', 'difficulty'],
      filterableColumns: { instructorId: [FilterOperator.EQ] },
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
    };

    return paginate(query, this.courseRepo, config);
  }

  async create(
    instructorId: number,
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
      course.instructorId = instructorId;

      return await this.courseRepo.save(course);
    } catch (error) {
      throw new BadRequestException('Error creating course: ' + error.message);
    }
  }

  async update(
    courseId: number,
    insturctorId: number,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<Course> {
    const course: Course = await this.checkCourse(courseId, insturctorId);

    if (file) {
      updateCourseDto.pathToImg = `${IMG_UPLOAD_DIR}${file.filename}`;
    }

    const updatedCourse = this.courseRepo.merge(course, updateCourseDto);
    return await this.courseRepo.save(updatedCourse);
  }

  async findEnrollments(
    insturctorId: number,
    courseId: number,
    query: PaginateQuery,
  ) {
    await this.checkCourse(courseId, insturctorId);
    return await this.enrollmentService.findByCourse(courseId, query);
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

  async removeCourse(courseId: number, instructorId: number): Promise<void> {
    this.checkCourse(courseId, instructorId);
    try {
      await super.remove(courseId);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Could not delete course.');
      }
      throw error;
    }
  }

  private async checkCourseExists(courseId: number): Promise<Course> {
    return await this.findById(courseId);
  }

  private checkCourseOwnership(
    course: Course,
    instructorId: number,
    customMessage?: string,
  ): void {
    if (course.instructorId !== instructorId) {
      const errorMessage =
        customMessage || 'instructor does not own the course';
      throw new UnauthorizedException(errorMessage);
    }
  }

  private async checkCourse(
    courseId: number,
    instructorId: number,
    errorMessage?: string,
  ): Promise<Course> {
    const course = await this.checkCourseExists(courseId);
    this.checkCourseOwnership(course, instructorId, errorMessage);
    return course;
  }
}
