import { Module } from '@nestjs/common';
import { CourseElementService } from './course-element.service';

@Module({
  providers: [CourseElementService],
  exports: [CourseElementService],
})
export class CourseElementModule {}
