import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateCourseDto: UpdateCourseDto) {
    throw new Error('Method not implemented.');
  }
  create(createCourseDto: CreateCourseDto) {
    return 'mock Course created successfully!';
  }
  findById(arg0: number) {
    throw new Error('Method not implemented.');
  }
}
