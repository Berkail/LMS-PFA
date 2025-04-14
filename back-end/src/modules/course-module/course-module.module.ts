import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleController } from './course-module.controller';
import { LessonModule } from '../lesson/lesson.module';
import { CourseModule } from './entities/course-module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [LessonModule, TypeOrmModule.forFeature([CourseModule])],
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
  exports: [CourseModuleService],
})
export class CourseModuleModule {}
