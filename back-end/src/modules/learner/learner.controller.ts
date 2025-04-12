import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LearnerService } from './learner.service';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { CreateEnrollmentDto } from '../enrollment/dto/create-enrollment.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.LEARNER)

@Controller('learners')
export class LearnerController {
  constructor(
    private readonly learnerService: LearnerService,
  ) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.learnerService.findAll(query);
  }

  @Get('enrollments/')
  async findEnrollments(@CurrentUser() learner : UserSessionDto, @Paginate() query: PaginateQuery) {
    return await this.learnerService.findEnrollments(learner.id, query);
  }

  @Get('enrollments/by-course')
  async findEnrollment(@CurrentUser() learner : UserSessionDto, @Query('courseId') courseId: number) {
    return await this.learnerService.findEnrollment(learner.id, courseId);
  }

  @Post('enrollments/')
  async enroll(@CurrentUser() learner : UserSessionDto, @Body() createEnrollmentDto: CreateEnrollmentDto) {
    const enrollTime : Date = new Date();
    return await this.learnerService.enroll(learner.id, createEnrollmentDto.courseId, enrollTime);
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
    await this.learnerService.remove(+id);
  }

  @Delete('enrollments')
  async removeEnrollment(@CurrentUser() learner : UserSessionDto, @Query('courseId') courseId: number) {
    return await this.learnerService.removeEnrollment(learner.id, courseId);
  }
}
