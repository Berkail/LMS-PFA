import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCourseElementDto } from './dto/create-course-element.dto';
import { UpdateCourseElementDto } from './dto/update-course-element.dto';
import { CourseElement } from './entities/course-element.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseElementService<T extends CourseElement> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createCourseElementDto: CreateCourseElementDto) {
    const courseElement = this.repository.create();
    try {
      return await this.repository.save(courseElement);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Couldn't create CourseElement");
    }
  }

  findAll() {
    return `This action returns all courseElement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseElement`;
  }

  update(id: number, updateCourseElementDto: UpdateCourseElementDto) {
    return `This action updates a #${id} courseElement`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseElement`;
  }
}
