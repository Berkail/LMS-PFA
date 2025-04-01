import { Module } from '@nestjs/common';
import { CourseElementService } from './course-element.service';
import { CourseElementMapper } from './mappers/course-element.mapper';

@Module({
  providers: [CourseElementService, CourseElementMapper],
  exports: [CourseElementService],
})
export class CourseElementModule {}
