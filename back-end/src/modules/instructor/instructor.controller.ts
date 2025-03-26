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
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { CursorPaginationParams } from 'src/core/pagination/params/cursor-pagination-params.interface';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.instructorService.create(createInstructorDto);
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
