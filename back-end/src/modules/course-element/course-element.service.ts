import { Injectable } from '@nestjs/common';
import { CourseElement } from './entities/course-element.entity';

@Injectable()
export class CourseElementService<T extends CourseElement> {
  constructor() {}
}
