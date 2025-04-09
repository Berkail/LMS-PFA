import {
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

@Injectable()
export class LessonService extends CourseElementService<Lesson> {
  constructor(
    @InjectRepository(Lesson) protected lessonRepository: Repository<Lesson>,
  ) {
    super(lessonRepository);
  }

  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lesson';
  }

  findAll() {
    return `This action returns all lesson`;
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

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  async remove(id: number): Promise<void> {
    try {
      await super.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Lesson with ID ${id} not found.`);
      }

      console.error(`[LessonService] Failed to remove lesson ${id}:`, error);
      throw new InternalServerErrorException('Could not delete the lesson.');
    }
  }

  publish(courseElement: Lesson, publishDate: Date): Promise<Lesson> {
    return super.publish(courseElement, publishDate);
  }
}
