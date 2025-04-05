import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LearnerService } from './learner.service';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('learners')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {}

  @Post()
  async create(@Body() createLearnerDto: CreateLearnerDto) {
    return await this.learnerService.create(createLearnerDto);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.learnerService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.learnerService.findById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLearnerDto: UpdateLearnerDto,
  ) {
    return await this.learnerService.update(+id, updateLearnerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.learnerService.remove(+id);
  }
}
