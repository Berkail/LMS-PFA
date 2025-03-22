import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LearnerService } from './learner.service';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { CursorPaginationDto } from 'src/core/pagination/dto/cursor-pagination.dto';

@Controller('learner')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {}

  @Post()
  async create(@Body() createLearnerDto: CreateLearnerDto) {
    createLearnerDto = {
      firstName: 'john',
      lastName: 'doe',
      username: 'timie',
      email: 'mimi@gmail.com',
      password: '123578',
      birthdate: new Date('2021-10-10'),
    };
    return await this.learnerService.create(createLearnerDto);
  }

  @Get()
  findAll(@Query() params: CursorPaginationDto) {
    return this.learnerService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learnerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearnerDto: UpdateLearnerDto) {
    return this.learnerService.update(+id, updateLearnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learnerService.remove(+id);
  }
}
