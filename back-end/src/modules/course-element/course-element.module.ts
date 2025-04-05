import { Module } from '@nestjs/common';
import { CourseElementService } from './course-element.service';
import { CourseElementMapper } from './mappers/course-element.mapper';
import { InstructorModule } from '../instructor/instructor.module';
import { SessionModule } from 'src/core/session/session.module';

@Module({
  imports: [InstructorModule],
  providers: [CourseElementService, CourseElementMapper],
  exports: [CourseElementModule],
})
export class CourseElementModule {}
