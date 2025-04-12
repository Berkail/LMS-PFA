import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

@Controller('course-module')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post()
  create(@Body() createCourseModuleDto: CreateCourseModuleDto) {
    return this.courseModuleService.create(createCourseModuleDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseModuleDto: UpdateCourseModuleDto) {
    return this.courseModuleService.update(+id, updateCourseModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseModuleService.remove(+id);
  }
}
