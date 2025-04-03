import { Module } from '@nestjs/common';
import { CourseElementService } from './course-element.service';
import { CourseElementMapper } from './mappers/course-element.mapper';
import { InstructorService } from '../instructor/instructor.service';

@Module({
  imports: [InstructorService],
  providers: [CourseElementService, CourseElementMapper],
  exports: [CourseElementModule],
})
export class CourseElementModule {}
