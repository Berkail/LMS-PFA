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
import { Roles } from 'src/core/auth/decorators';
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

  @Get('enrollments')
  async findEnrollments(@Req() req: Request, @Paginate() query: PaginateQuery) {
    return await this.learnerService.findEnrollments(req, query);
  }

  @Post('enrollments/:courseId')
  async enroll(@Req() req : Request, @Param('courseId') courseId: string) {
    return await this.learnerService.enroll(req, +courseId);
  }
}
