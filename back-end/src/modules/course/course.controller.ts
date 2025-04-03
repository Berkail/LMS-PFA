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
import { CursorPaginationParams } from 'src/core/pagination/params/cursor-pagination-params.interface';

@Controller('course')
export class CourseController {
  instructorService: any;
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(req, createCourseDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    try {
      const params: CursorPaginationParams = request['paginationParams'];
      const result = await this.instructorService.findAll(params);
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException('Failed to fetch Instructors.');
    }
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
}
