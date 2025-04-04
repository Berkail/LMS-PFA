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
import { LearnerService } from './learner.service';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { CursorPaginationParams } from 'src/core/pagination/params/cursor-pagination-params.interface';

@Controller('learners')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {}

  @Post()
  async create(@Body() createLearnerDto: CreateLearnerDto) {
    return await this.learnerService.create(createLearnerDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    try {
      const params: CursorPaginationParams = request['paginationParams'];
      const result = await this.learnerService.findAll(params);
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException('Failed to fetch learners.');
    }
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
