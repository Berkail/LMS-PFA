import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { CourseElementService } from '../course-element/course-element.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDF_UPLOAD_DIR } from 'src/core/common/const/lms.const';

@Injectable()
export class LessonService extends CourseElementService<Lesson> {
  constructor(@InjectRepository(Lesson) private readonly lessonRepo : Repository<Lesson>){
    super(lessonRepo)
  }

  removeByObj(lesson: Lesson) {
    throw new Error('Method not implemented.');
  }

  async create(
    courseModuleId: number,
    createLessonDto: CreateLessonDto,
    file: Express.Multer.File,
  ): Promise<Lesson> {
    if(!file){
      throw new BadRequestException('A PDF file is required for the course material.');
    }
    let lesson = this.lessonRepo.create(createLessonDto);
    lesson.courseModuleId = courseModuleId;
    lesson.pathToPdf = `${PDF_UPLOAD_DIR}${file.filename}`
  
    return await this.lessonRepo.save(lesson);
  }

  async findById(id: number) {
    try {
      return await super.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Lesson with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    file?: Express.Multer.File,
  ): Promise<Lesson> {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
    });
  
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found.`);
    }
  
    const updatedLesson = this.lessonRepo.merge(lesson, updateLessonDto);
  
    if (file) {
      updatedLesson.pathToPdf = `${PDF_UPLOAD_DIR}${file.filename}`;
    }
  
    return await this.lessonRepo.save(updatedLesson);
  }
  

  async remove(id: number): Promise<void> {
  }
}
