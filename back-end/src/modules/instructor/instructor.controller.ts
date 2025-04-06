import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.instructorService.create(createInstructorDto);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.instructorService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.instructorService.findById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return await this.instructorService.update(+id, updateInstructorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.instructorService.remove(+id);
  }
}
