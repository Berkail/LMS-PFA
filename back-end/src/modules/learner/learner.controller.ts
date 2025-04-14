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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('learners')
@UseGuards(AuthGuard)
@Controller('learners')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Find all learners' })
  findAll(@Paginate() query: PaginateQuery) {
    return this.learnerService.findAll(query);
  }

  @Get('/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Find authenticated learner info' })
  findMe(@CurrentUser() learner: UserSessionDto) {
    return this.learnerService.findById(learner.id);
  }

  @Patch('/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Update authenticated learner info' })
  update(
    @CurrentUser() learner: UserSessionDto,
    @Body() updateLearnerDto: UpdateLearnerDto,
  ) {
    return this.learnerService.update(learner.id, updateLearnerDto);
  }

  @Delete('/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Remove authenticated learner' })
  remove(@CurrentUser() learner: UserSessionDto) {
    return this.learnerService.remove(learner.id);
  }

  @Get('me/enrollments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Find authenticated learner enrollments' })
  findEnrollments(
    @CurrentUser() learner: UserSessionDto,
    @Paginate() query: PaginateQuery,
  ) {
    return this.learnerService.findEnrollments(learner.id, query);
  }

  @Get('me/enrollments/by-course')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Find authenticated learner enrollment by course' })
  findEnrollment(
    @CurrentUser() learner: UserSessionDto,
    @Query('courseId') courseId: number,
  ) {
    return this.learnerService.findEnrollment(learner.id, courseId);
  }

  @Delete('enrollments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Unenroll from a course by courseId query' })
  removeEnrollment(
    @CurrentUser() learner: UserSessionDto,
    @Query('courseId') courseId: number,
  ) {
    return this.learnerService.removeEnrollment(learner.id, courseId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiOperation({ summary: 'Find a learner by ID' })
  findById(@Param('id') id: string) {
    return this.learnerService.findById(+id);
  }
}
