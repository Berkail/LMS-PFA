import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseMapper } from './mappers/course.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { InstructorModule } from '../instructor/instructor.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), InstructorModule, forwardRef(() => EnrollmentModule)],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService]
})
export class CourseModule {}
