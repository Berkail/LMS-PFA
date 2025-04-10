import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseMapper } from './mappers/course.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { InstructorModule } from '../instructor/instructor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), InstructorModule],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService]
})
export class CourseModule {}
