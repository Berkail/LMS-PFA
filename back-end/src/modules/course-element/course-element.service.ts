import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CourseElement } from './entities/course-element.entity';
import { Repository } from 'typeorm';

@Injectable()
export abstract class CourseElementService<T extends CourseElement> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: number): Promise<T> {
    const courseElement = await this.repository.findOne({
      where: { id },
    } as any);
    if (!courseElement) {
      throw new NotFoundException(`Course element with id ${id} not found`);
    }
    return courseElement;
  }

  async publishById(id: number, publishDate: Date): Promise<void> {
    const courseElement = await this.findById(id);
    await this.publish(courseElement, publishDate);
  }

  async publish(courseElement: T, publishDate: Date): Promise<T> {
    if (courseElement.publishedAt) {
      throw new BadRequestException('This element is already published.');
    }
    courseElement.publishedAt = publishDate;
    return await this.repository.save(courseElement);
  }
}
