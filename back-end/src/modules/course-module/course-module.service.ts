import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseElementService } from '../course-element/course-element.service';
import { CourseModule } from './entities/course-module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';
import { CreateLessonDto } from '../lesson/dto/create-lesson.dto';

@Injectable()
export class CourseModuleService extends CourseElementService<CourseModule> {
  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModuleRepo: Repository<CourseModule>,
    private readonly lessonService: LessonService,
  ) {
    super(courseModuleRepo);
  }

  async create(courseId: number, createCourseModuleDto: CreateCourseModuleDto) {
    try {
      let courseModule = this.repository.create(createCourseModuleDto);
      courseModule.courseId = courseId;

      return await this.repository.save(courseModule);
    } catch (error) {
      throw new InternalServerErrorException('Error creating course module');
    }
  }

  async createLesson(
    instructorId: number,
    courseModuleId: number,
    createLessonDto: CreateLessonDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('A PDF file is required for the course lesson.');
    }
    await this.validateCourseModuleOwnership(instructorId, courseModuleId);
    this.lessonService.create(courseModuleId, createLessonDto, file);
  }

  async update(
    instructorId: number,
    courseModuleId: number,
    updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    const courseModule = await this.validateCourseModuleOwnership(
      instructorId,
      courseModuleId,
    );
    const updateCourseModule = this.courseModuleRepo.merge(
      courseModule,
      updateCourseModuleDto,
    );
    return await this.courseModuleRepo.save(updateCourseModule);
  }

  async remove(instructorId: number, courseModuleId: number) {
    const courseModule = await this.validateCourseModuleOwnership(
      instructorId,
      courseModuleId,
    );
    await this.removeByObj(courseModule);
    return { message: 'Course module deleted successfully' };
  }

  async removeByObj(courseModule: CourseModule) {
    try {
      const moduleWithLessons = await this.courseModuleRepo.findOne({
        where: { id: courseModule.id },
        relations: ['lessons'],
      });

      if (!moduleWithLessons) {
        throw new NotFoundException(
          `CourseModule with ID ${courseModule.id} not found`,
        );
      }

      for (const lesson of moduleWithLessons.lessons) {
        await this.lessonService.removeByObj(lesson);
      }

      await this.courseModuleRepo.softRemove(courseModule);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occurred while removing lessons or course module',
      );
    }
  }

  async ensureCourseModuleExists(
    courseModuleId: number,
  ): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepo.findOne({
      where: { id: courseModuleId },
    });

    if (!courseModule) {
      throw new NotFoundException(
        `courseModule with ID ${courseModuleId} not found`,
      );
    }

    return courseModule;
  }

  async validateCourseModuleOwnership(
    userId: number,
    courseModuleId: number,
  ): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepo
      .createQueryBuilder('module')
      .innerJoin('module.course', 'course')
      .where('module.id = :moduleId', { moduleId: courseModuleId })
      .andWhere('course.instructorId = :userId', { userId })
      .getOne();

    if (!courseModule) {
      throw new ForbiddenException(`Course module not found or access denied`);
    }

    return courseModule;
  }
}
