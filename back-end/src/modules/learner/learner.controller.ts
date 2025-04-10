import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LearnerService } from './learner.service';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.LEARNER)

@Controller('learners')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.learnerService.findAll(query);
  }

  @Get('enrollments/')
  async findEnrollments(@CurrentUser() learner, @Paginate() query: PaginateQuery) {
    return await this.learnerService.findEnrollments(learner, query);
  }

  @Post('enrollments/:courseId')
  async enroll(@CurrentUser() learner, @Param('courseId') courseId: string) {
    const enrollTime : Date = new Date();
    return await this.learnerService.enroll(learner, +courseId, enrollTime);
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
