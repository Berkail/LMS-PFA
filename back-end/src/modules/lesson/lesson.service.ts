import {
  BadRequestException,
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
    file: Express.Multer.File,
  ): Promise<Lesson> {
    if (!file) {
      throw new BadRequestException(
        'A PDF file is required for the course material.',
      );
    }
    let lesson = this.lessonRepo.create(createLessonDto);
    lesson.courseModuleId = courseModuleId;
    lesson.pathToPdf = `${PDF_UPLOAD_DIR}${file.filename}`;

    return await this.lessonRepo.save(lesson);
  }

  async update(
    instructorId: number,
    lessonId: number,
    updateLessonDto: UpdateLessonDto,
    file?: Express.Multer.File,
  ): Promise<Lesson> {
    const lesson = await this.validateLessonOwnership(instructorId, lessonId);

    const updatedLesson = this.lessonRepo.merge(lesson, updateLessonDto);

    if (file) {
      if (lesson.pathToPdf) {
        await FileUploadService.delete(lesson.pathToPdf);
      }

      updatedLesson.pathToPdf = `${PDF_UPLOAD_DIR}${file.filename}`;
    }

    return await this.lessonRepo.save(updatedLesson);
  }

  async remove(InstructorId: number, lessonId: number) {
    const lesson = await this.validateLessonOwnership(InstructorId, lessonId);
    await this.removeByObj(lesson);
    return { message: 'lesson deleted successfully' };
  }

  async removeByObj(lesson: Lesson) {
    if (lesson.pathToPdf) {
      await FileUploadService.delete(lesson.pathToPdf);
    }

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
      .select('lesson.id')
      .getOne();

    if (!lesson) {
      throw new ForbiddenException(
        `You do not have permission to modify this lesson.`,
      );
    }

    return lesson;
  }
}
