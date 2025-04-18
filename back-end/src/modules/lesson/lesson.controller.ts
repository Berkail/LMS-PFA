import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { UserRole } from '../user/enums/user-role.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('lessons')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Patch(':lessonId')
  @ApiOperation({ summary: 'Update a lesson' })
  async update(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(
      instructor.id,
      +lessonId,
      updateLessonDto,
    );
  }

  @Delete(':lessonId')
  @ApiOperation({ summary: 'Remove a lesson' })
  async remove(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonService.remove(instructor.id, +lessonId);
  }

  @Patch(':lessonId/publish')
  @ApiOperation({ summary: 'Publish a lesson' })
  async publish(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
  ) {
    const publishTime: Date = new Date();
    return await this.lessonService.publish(
      instructor.id,
      +lessonId,
      publishTime,
    );
  }
}
