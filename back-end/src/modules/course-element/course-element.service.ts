import { Injectable } from '@nestjs/common';
import { CreateCourseElementDto } from './dto/create-course-element.dto';
import { UpdateCourseElementDto } from './dto/update-course-element.dto';

@Injectable()
export class CourseElementService {
  create(createCourseElementDto: CreateCourseElementDto) {
    return 'This action adds a new courseElement';
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
