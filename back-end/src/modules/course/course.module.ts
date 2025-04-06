import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseMapper } from './mappers/course.mapper';
import { CourseElementModule } from '../course-element/course-element.module';

@Module({
  imports: [CourseElementModule],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
})
export class CourseModule {}
