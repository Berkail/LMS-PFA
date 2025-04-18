import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { CourseElementService } from '../course-element/course-element.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDF_UPLOAD_DIR } from 'src/core/common/const/lms.const';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';

@Injectable()
export class LessonService extends CourseElementService<Lesson> {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
  ) {
    super(lessonRepo);
  }

  async create(
    courseModuleId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    let lesson = this.lessonRepo.create(createLessonDto);
    lesson.courseModuleId = courseModuleId;

    return await this.lessonRepo.save(lesson);
  }

  async update(
    instructorId: number,
    lessonId: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    const lesson = await this.validateLessonOwnership(instructorId, lessonId);

    const updatedLesson = this.lessonRepo.merge(lesson, updateLessonDto);

    return await this.lessonRepo.save(updatedLesson);
  }

  async remove(InstructorId: number, lessonId: number) {
    const lesson = await this.validateLessonOwnership(InstructorId, lessonId);
    await this.removeByObj(lesson);
    return { message: 'lesson deleted successfully' };
  }

  async removeByObj(lesson: Lesson) {
    try {
      await this.lessonRepo.softRemove(lesson);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to remove lesson`);
    }
  }

  async ensureLessonExists(lessonId: number) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found.`);
    }

    return lesson;
  }
  async validateLessonOwnership(
    userId: number,
    lessonId: number,
  ): Promise<Lesson> {
    const lesson = await this.lessonRepo
      .createQueryBuilder('lesson')
      .innerJoin('lesson.courseModule', 'courseModule')
      .innerJoin('courseModule.course', 'course')
      .where('lesson.id = :lessonId', { lessonId })
      .andWhere('course.instructorId = :userId', { userId })
      .getOne();

    if (!lesson) {
      throw new ForbiddenException(
        `You do not have permission to modify this lesson.`,
      );
    }

    return lesson;
  }

  async publish(instructorId: number, lessonId: number, publishTime: Date) {
    const lesson = await this.validateLessonOwnership(instructorId, lessonId);
    await this.publishByObj(lesson, publishTime);

    return { message: 'Lesson published successfully' };
  }

  async publishByObj(lesson: Lesson, publishTime: Date) {
    const lessonWithCourseModule = await this.lessonRepo.findOne({
      where: { id: lesson.id },
      relations: ['courseModule'],
    });

    if (!lessonWithCourseModule || !lessonWithCourseModule.courseModule) {
      throw new ConflictException(
        'The associated course module was not found.',
      );
    }

    if (!lessonWithCourseModule.courseModule.publishedAt) {
      throw new ConflictException(
        'The associated course module is not published. Please publish the course module first.',
      );
    }

    if (lessonWithCourseModule.publishedAt) {
      throw new ConflictException('This lesson has already been published.');
    }

    lessonWithCourseModule.publishedAt = publishTime;
    await this.lessonRepo.save(lessonWithCourseModule);

    return lessonWithCourseModule;
  }
}
