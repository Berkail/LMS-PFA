import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';
import { MAX_PDF_SIZE } from 'src/core/common/const/lms.const';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { UserRole } from '../user/enums/user-role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseInterceptors(
    FileInterceptor('lessonPdf', {
      storage: FileUploadService.getPDFStorage(),
      fileFilter: FileUploadService.getPDFFilter(),
      limits: { fileSize: MAX_PDF_SIZE },
    }),
  )
  @Patch(':lessonId')
  async update(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lessonService.update(
      instructor.id,
      +lessonId,
      updateLessonDto,
      file,
    );
  }

  @Delete(':lessonId')
  async remove(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonService.remove(instructor.id, +lessonId);
  }

  @Patch(':lessonId/publish')
  async publish(
    @CurrentUser() instructor: UserSessionDto,
    @Param('lessonId') lessonId: string,
  ){
    const publishTime : Date = new Date();
    return await this.lessonService.publish(instructor.id, +lessonId, publishTime);
  }
}
