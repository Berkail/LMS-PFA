import { Controller, Get, Post, Body } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { Instructor } from './entities/instructor.entity';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get()
  getAll(): Promise<Instructor[]> {
    return this.instructorService.findAll();
  }

  @Post()
  create(@Body() instructor: Partial<Instructor>): Promise<Instructor> {
    return this.instructorService.create(instructor);
  }
}