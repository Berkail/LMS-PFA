import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleController } from './course-module.controller';

@Module({
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
})
export class CourseModuleModule {}
