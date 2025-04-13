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

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('course-modules')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @UseInterceptors(
    FileInterceptor('lessonPdf', {
      storage: FileUploadService.getPDFStorage(),
      fileFilter: FileUploadService.getPDFFilter(),
      limits: { fileSize: MAX_PDF_SIZE },
    }),
  )
  @Post(':courseModuleId/lessons')
  async createLesson(
    @CurrentUser() instructor : UserSessionDto,
    @Param('courseModuleId') courseModuleId: number,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file : Express.Multer.File,
  ) {
    return await this.courseModuleService.createLesson(
      instructor.id,
      courseModuleId,
      createLessonDto,
      file,
    );
  }

  @Patch(':courseModuleId')
  async updateCourseModule(
    @CurrentUser() instructor : UserSessionDto,
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
  async deleteCourseModule(
    @CurrentUser() instructor,
    @Param('courseModuleId') courseModuleId: number,
  ) {
    return await this.courseModuleService.remove(instructor.id, courseModuleId);
  }
}
