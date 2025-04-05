import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  /*
  instructorService: any;
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(req, createCourseDto);
  }

  @Get()
  async findAll(@Req() request: Request) {

  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.courseService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
  */
}
