import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';
import { MAX_PDF_SIZE } from 'src/core/common/const/lms.const';

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
  update(@Param('lessonId') lessonId: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+lessonId, updateLessonDto);
  }

  @Delete(':lessonId')
  remove(@Param('lessonId') lessonId: string) {
    return this.lessonService.remove(+lessonId);
  }
}
