import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseMapper } from './mappers/course.mapper';
import { CourseElementService } from '../course-element/course-element.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { IMG_UPLOAD_DIR } from 'src/core/common/const/lms.const';
import { CourseModuleService } from '../course-module/course-module.service';
import { CreateCourseModuleDto } from '../course-module/dto/create-course-module.dto';
import { UpdateCourseModuleDto } from '../course-module/dto/update-course-module.dto';

@Injectable()
export class CourseService extends CourseElementService<Course> {
  constructor(
    private readonly courseMapper: CourseMapper,
    @InjectRepository(Course)
    protected readonly courseRepo: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
    private readonly courseModuleService: CourseModuleService,
  ) {
    super(courseRepo);
  }

  // -------------------------------------------------------------------
  // 🟢 CREATE
  // -------------------------------------------------------------------
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
      const course = this.courseRepo.create();
      this.courseMapper.toEntity(course, createCourseDto);
      course.instructorId = instructorId;

      return await this.courseRepo.save(course);
    } catch (error) {
      throw new BadRequestException('Error creating course: ' + error.message);
    }
  }

  async createCourseModule(
    courseId: number,
    instructorId: number,
    createCourseModuleDto: CreateCourseModuleDto,
  ) {
    await this.validateInstructorCourseOwnership(courseId, instructorId);
    return await this.courseModuleService.create(
      courseId,
      createCourseModuleDto,
    );
  }

  // -------------------------------------------------------------------
  // 🔵 READ
  // -------------------------------------------------------------------
  async findAllCourses(query: PaginateQuery): Promise<Paginated<Course>> {
    const config: PaginateConfig<Course> = {
      sortableColumns: ['id', 'createdAt', 'publishedAt'],
      searchableColumns: ['title', 'difficulty'],
      filterableColumns: { instructorId: [FilterOperator.EQ] },
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
      relations: { courseModules: { lessons: true } },
    };

    return paginate(query, this.courseRepo, config);
  }

  async findCourseById(courseId: number): Promise<Course> {
    try {
      return await super.findById(courseId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Course with id ${courseId} not found`);
      }
      throw error;
    }
  }

  async findCourseEnrollments(
    courseId: number,
    instructorId: number,
    query: PaginateQuery,
  ) {
    await this.validateInstructorCourseOwnership(courseId, instructorId);
    return await this.enrollmentService.findByCourse(courseId, query);
  }

  // -------------------------------------------------------------------
  // 🟡 UPDATE
  // -------------------------------------------------------------------
  async updateCourse(
    courseId: number,
    instructorId: number,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<Course> {
    const course = await this.validateInstructorCourseOwnership(
      courseId,
      instructorId,
    );

    if (file) {
      updateCourseDto.pathToImg = `${IMG_UPLOAD_DIR}${file.filename}`;
    }

    const updatedCourse = this.courseRepo.merge(course, updateCourseDto);
    return await this.courseRepo.save(updatedCourse);
  }

  async updateCourseModule(
    courseId: number,
    instructorId: number,
    courseModuleId: number,
    updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    await this.validateInstructorCourseOwnership(courseId, instructorId);
    return await this.courseModuleService.update(
      courseId,
      courseModuleId,
      updateCourseModuleDto,
    );
  }

  // -------------------------------------------------------------------
  // 🔴 DELETE
  // -------------------------------------------------------------------
  async remove(courseId: number, instructorId: number) {
    await this.validateInstructorCourseOwnership(courseId, instructorId);

    const course: Course | null = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['courseModules'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} was not found`);
    }

    for (const courseModule of course.courseModules) {
      await this.courseModuleService.removeByObj(courseModule);
    }

    try {
      await this.courseRepo.softRemove(course);
      console.log(`Course ${courseId} and its modules have been soft deleted.`);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove course ${courseId}: ${error.message}`,
      );
    }

    return { message: 'course deleted successfully' };
  }

  async deleteCourseModule(
    courseId: number,
    instructorId: number,
    courseModuleId: number,
  ) {
    await this.validateInstructorCourseOwnership(courseId, instructorId);
    return await this.courseModuleService.remove(courseId, courseModuleId);
  }

  // -------------------------------------------------------------------
  // 🎯 ENROLLMENT ACTIONS
  // -------------------------------------------------------------------
  async enrollLearner(
    courseId: number,
    learnerId: number,
    enrollTime: Date,
  ): Promise<Enrollment> {
    await this.ensureCourseExists(courseId);
    return await this.enrollmentService.create(courseId, learnerId, enrollTime);
  }

  // -------------------------------------------------------------------
  // ⚙️ UTILITIES / VALIDATORS
  // -------------------------------------------------------------------
  private async ensureCourseExists(courseId: number): Promise<Course> {
    return await this.findCourseById(courseId);
  }

  private async validateInstructorCourseOwnership(
    courseId: number,
    instructorId: number,
    customMessage?: string,
  ): Promise<Course> {
    const course = await this.ensureCourseExists(courseId);

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException(
        customMessage || 'Instructor does not own this course',
      );
    }

    return course;
  }

  async publish(
    instructorId: number,
    courseId: number,
    publishTime: Date,
  ) {
    const course = await this.validateInstructorCourseOwnership(
      instructorId,
      courseId,
    );
  
    await this.publishByObj(course, publishTime);
  
    return { message: 'Course, its modules, and their lessons published successfully' };
  }
  
  async publishByObj(course: Course, publishTime: Date) {
    const courseWithRelations = await this.courseRepo.findOne({
      where: { id: course.id },
      relations: ['courseModules'],
    });
  
    if (!courseWithRelations) {
      throw new NotFoundException('Course not found.');
    }
  
    if (courseWithRelations.publishedAt) {
      throw new ConflictException('This course has already been published.');
    }
  
    // Publish the course
    courseWithRelations.publishedAt = publishTime;
    await this.courseRepo.save(courseWithRelations);
  
    // Publish all course modules and their lessons
    for (const courseModule of courseWithRelations.courseModules) {
      await this.courseModuleService.publishByObj(courseModule, publishTime);
    }
  }
  
}
