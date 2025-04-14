import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { CreateLessonDto } from '../lesson/dto/create-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';
import { MAX_PDF_SIZE } from 'src/core/common/const/lms.const';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('course-modules')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post(':courseModuleId/lessons')
  @ApiOperation({ summary: 'Create a new lesson for a course module' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  async createLesson(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseModuleId') courseModuleId: number,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return await this.courseModuleService.createLesson(
      instructor.id,
      courseModuleId,
      createLessonDto,
    );
  }

  @Patch(':courseModuleId')
  @ApiOperation({ summary: 'Update a course module' })
  @ApiResponse({ status: 200, description: 'Course module updated successfully' })
  async updateCourseModule(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseModuleId') courseModuleId: number,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    return await this.courseModuleService.update(
      instructor.id,
      courseModuleId,
      updateCourseModuleDto,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':courseModuleId')
  @ApiOperation({ summary: 'Delete a course module' })
  @ApiResponse({ status: 200, description: 'Course module deleted successfully' })
  async deleteCourseModule(
    @CurrentUser() instructor,
    @Param('courseModuleId') courseModuleId: number,
  ) {
    return await this.courseModuleService.remove(instructor.id, courseModuleId);
  }

  @Patch(':courseModuleId/publish')
  @ApiOperation({ summary: 'Publish a course module' })
  @ApiResponse({ status: 200, description: 'Course module published successfully' })
  async publish(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseModuleId') courseModuleId: string,
  ) {
    const publishTime: Date = new Date();
    return await this.courseModuleService.publish(
      instructor.id,
      +courseModuleId,
      publishTime,
    );
  }
}
